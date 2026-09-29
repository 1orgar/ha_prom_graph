"""PromQL alert rules evaluated by Home Assistant (like Prometheus alerting rules).

Every series returned by the query is an alert instance of its own:

    inactive --(condition true)--> pending --(true for `for` seconds)--> firing
        ^                                                                  |
        +-------------------------(condition false / series gone)----------+

The state lives in memory: after a restart pending timers start again
(Prometheus without `ALERTS_FOR_STATE` behaves the same).
"""

from __future__ import annotations

import operator
import re
from collections.abc import Callable, Iterable
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from .const import (
    CONF_CONDITION,
    CONF_FOR,
    CONF_SEVERITY,
    CONF_SUMMARY,
    CONF_THRESHOLD,
    CONDITION_ANY,
)

STATE_INACTIVE = "inactive"
STATE_PENDING = "pending"
STATE_FIRING = "firing"

# condition keys are translation keys ([a-z0-9_]), the symbol is only for display
_OPS: dict[str, Callable[[float, float], bool]] = {
    "gt": operator.gt,
    "gte": operator.ge,
    "lt": operator.lt,
    "lte": operator.le,
    "eq": operator.eq,
    "ne": operator.ne,
}
CONDITION_SYMBOLS = {"gt": ">", "gte": ">=", "lt": "<", "lte": "<=", "eq": "==", "ne": "!="}
_FROM_SYMBOL = {symbol: key for key, symbol in CONDITION_SYMBOLS.items()}

LabelKey = tuple[tuple[str, str], ...]


def duration_seconds(value: Any) -> float:
    """`for` from the flow: DurationSelector dict, number of seconds or `5m` style string."""
    if value in (None, ""):
        return 0.0
    if isinstance(value, dict):
        return float(
            value.get("days", 0) * 86400
            + value.get("hours", 0) * 3600
            + value.get("minutes", 0) * 60
            + value.get("seconds", 0)
        )
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip()
    if re.fullmatch(r"\d+(\.\d+)?", text):
        return float(text)
    mult = {"s": 1, "m": 60, "h": 3600, "d": 86400, "w": 604800}
    parts = re.findall(r"(\d+(?:\.\d+)?)([smhdw])", text)
    if not parts or "".join(n + u for n, u in parts) != text.replace(" ", ""):
        raise ValueError(f"invalid duration: {value}")
    return float(sum(float(n) * mult[u] for n, u in parts))


@dataclass
class AlertRule:
    """Rule of one `alert` subentry."""

    name: str
    condition: str = CONDITION_ANY
    threshold: float | None = None
    for_seconds: float = 0.0
    severity: str | None = None
    summary: str | None = None

    @classmethod
    def from_subentry(cls, title: str, data: dict[str, Any]) -> AlertRule:
        threshold = data.get(CONF_THRESHOLD)
        condition = data.get(CONF_CONDITION) or CONDITION_ANY
        return cls(
            name=title,
            condition=_FROM_SYMBOL.get(condition, condition),  # also accept `>` style symbols
            threshold=None if threshold in (None, "") else float(threshold),
            for_seconds=duration_seconds(data.get(CONF_FOR)),
            severity=data.get(CONF_SEVERITY) or None,
            summary=data.get(CONF_SUMMARY) or None,
        )

    def matches(self, value: float) -> bool:
        """`any`: every returned series is active (the query itself is the condition, e.g. `up == 0`)."""
        if self.condition == CONDITION_ANY or self.threshold is None:
            return value == value  # NaN never matches
        op = _OPS.get(self.condition)
        return bool(op and op(value, self.threshold))

    def describe_condition(self) -> str:
        """`any` or e.g. `> 1` for the entity attributes."""
        if self.condition == CONDITION_ANY or self.threshold is None:
            return CONDITION_ANY
        return f"{CONDITION_SYMBOLS.get(self.condition, self.condition)} {self.threshold:g}"

    def render_summary(self, labels: dict[str, str], value: float) -> str | None:
        """Prometheus-like templating: `{{ $value }}`, `{{ $labels.instance }}`."""
        if not self.summary:
            return None

        def repl(m: re.Match[str]) -> str:
            expr = m.group(1).strip()
            if expr == "$value":
                return f"{value:g}"
            if expr.startswith("$labels."):
                return labels.get(expr[len("$labels.") :], "")
            return m.group(0)

        return re.sub(r"\{\{\s*([^}]+?)\s*\}\}", repl, self.summary)


@dataclass
class AlertInstance:
    """One series of an alert."""

    labels: dict[str, str]
    value: float
    active_since: datetime
    state: str = STATE_PENDING


@dataclass
class Transition:
    """State change reported as a Home Assistant event."""

    labels: dict[str, str]
    value: float | None
    state: str  # firing | resolved


@dataclass
class RuleState:
    instances: dict[LabelKey, AlertInstance] = field(default_factory=dict)


def _key(labels: dict[str, str]) -> LabelKey:
    return tuple(sorted(labels.items()))


class AlertTracker:
    """Keeps pending / firing instances of all alert rules of one server."""

    def __init__(self) -> None:
        self._rules: dict[str, RuleState] = {}

    def update(
        self, rule_id: str, rule: AlertRule, series: Iterable[tuple[dict[str, str], float]], now: datetime
    ) -> list[Transition]:
        """Evaluate a fresh query result; returns firing / resolved transitions."""
        state = self._rules.setdefault(rule_id, RuleState())
        transitions: list[Transition] = []
        seen: set[LabelKey] = set()
        for raw_labels, value in series:
            # like Prometheus: the metric name is not part of the alert labels
            labels = {k: v for k, v in raw_labels.items() if k != "__name__"}
            if not rule.matches(value):
                continue
            key = _key(labels)
            seen.add(key)
            inst = state.instances.get(key)
            if inst is None:
                inst = AlertInstance(labels=labels, value=value, active_since=now)
                state.instances[key] = inst
            inst.value = value
            if inst.state == STATE_PENDING and (now - inst.active_since).total_seconds() >= rule.for_seconds:
                inst.state = STATE_FIRING
                transitions.append(Transition(labels, value, STATE_FIRING))
        for key in [k for k in state.instances if k not in seen]:
            inst = state.instances.pop(key)
            if inst.state == STATE_FIRING:
                transitions.append(Transition(inst.labels, None, "resolved"))
        return transitions

    def instances(self, rule_id: str) -> list[AlertInstance]:
        state = self._rules.get(rule_id)
        return sorted(state.instances.values(), key=lambda i: i.active_since) if state else []

    def remove_missing(self, rule_ids: Iterable[str]) -> None:
        keep = set(rule_ids)
        for rule_id in [r for r in self._rules if r not in keep]:
            del self._rules[rule_id]

    def state(self, rule_id: str) -> str:
        states = {i.state for i in self.instances(rule_id)}
        if STATE_FIRING in states:
            return STATE_FIRING
        return STATE_PENDING if states else STATE_INACTIVE

    def as_prometheus(self, rule_id: str, rule: AlertRule) -> list[dict[str, Any]]:
        """Instances in the `/api/v1/alerts` format (for the Alerts card)."""
        out = []
        for inst in self.instances(rule_id):
            labels = {"alertname": rule.name, **inst.labels}
            if rule.severity:
                labels["severity"] = rule.severity
            annotations = {}
            if summary := rule.render_summary(inst.labels, inst.value):
                annotations["summary"] = summary
            out.append(
                {
                    "labels": labels,
                    "annotations": annotations,
                    "state": inst.state,
                    "activeAt": inst.active_since.isoformat(),
                    "value": f"{inst.value:g}",
                    "source": "home_assistant",
                }
            )
        return out

