"""Alert rule state machine (no Home Assistant needed)."""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.util import dt as dt_util

from custom_components.prometheus_dashboard.alerting import (
    STATE_FIRING,
    STATE_INACTIVE,
    STATE_PENDING,
    AlertRule,
    AlertTracker,
    duration_seconds,
)

T0 = dt_util.utcnow()


def test_duration_parsing() -> None:
    assert duration_seconds({"hours": 1, "minutes": 30}) == 5400
    assert duration_seconds("5m") == 300
    assert duration_seconds("1h30m") == 5400
    assert duration_seconds(90) == 90
    assert duration_seconds(None) == 0
    with pytest.raises(ValueError):
        duration_seconds("5 minutes")

def test_condition_keys_and_symbols() -> None:
    rule = AlertRule.from_subentry("Load", {"condition": "gte", "threshold": 2})
    assert rule.matches(2) and not rule.matches(1.9)
    assert rule.describe_condition() == ">= 2"
    # `>` style symbols (hand-written data) are accepted too
    assert AlertRule.from_subentry("Load", {"condition": "<", "threshold": 1}).condition == "lt"
    assert AlertRule.from_subentry("Down", {}).describe_condition() == "any"




def test_every_series_is_tracked_separately_with_for() -> None:
    rule = AlertRule(
        name="HighLoad", condition="gt", threshold=1, for_seconds=300, severity="warning",
        summary="{{ $labels.instance }} load {{ $value }}",
    )
    tracker = AlertTracker()
    series = [({"__name__": "node_load1", "instance": "a"}, 2.0), ({"instance": "b"}, 0.5), ({"instance": "c"}, 3.0)]

    # t0: a and c meet the condition -> pending, nothing fires yet
    assert tracker.update("r", rule, series, T0) == []
    assert tracker.state("r") == STATE_PENDING
    assert [i.labels["instance"] for i in tracker.instances("r")] == ["a", "c"]
    assert "__name__" not in tracker.instances("r")[0].labels

    # +4 min: still pending (firing window is 5 min)
    assert tracker.update("r", rule, series, T0 + timedelta(minutes=4)) == []

    # +5 min: both fire, one transition per series
    fired = tracker.update("r", rule, series, T0 + timedelta(minutes=5))
    assert sorted(t.labels["instance"] for t in fired) == ["a", "c"]
    assert tracker.state("r") == STATE_FIRING

    # c recovers -> resolved; a keeps firing (no new transition)
    resolved = tracker.update("r", rule, [({"instance": "a"}, 2.5), ({"instance": "c"}, 0.1)], T0 + timedelta(minutes=6))
    assert [(t.labels["instance"], t.state) for t in resolved] == [("c", "resolved")]

    assert tracker.as_prometheus("r", rule) == [
        {
            "labels": {"alertname": "HighLoad", "instance": "a", "severity": "warning"},
            "annotations": {"summary": "a load 2.5"},
            "state": "firing",
            "activeAt": T0.isoformat(),
            "value": "2.5",
            "source": "home_assistant",
        }
    ]

    # series disappears (e.g. `up == 0` returns nothing) -> resolved, inactive
    assert [t.state for t in tracker.update("r", rule, [], T0 + timedelta(minutes=7))] == ["resolved"]
    assert tracker.state("r") == STATE_INACTIVE


def test_series_that_drops_out_restarts_the_window() -> None:
    rule = AlertRule(name="Down", for_seconds=120)  # condition "any": the query is the condition
    tracker = AlertTracker()
    tracker.update("r", rule, [({"job": "x"}, 0.0)], T0)
    tracker.update("r", rule, [], T0 + timedelta(minutes=1))  # recovered before the window ended
    tracker.update("r", rule, [({"job": "x"}, 0.0)], T0 + timedelta(minutes=2))
    assert tracker.state("r") == STATE_PENDING  # window started again
    assert tracker.update("r", rule, [({"job": "x"}, 0.0)], T0 + timedelta(minutes=4))[0].state == STATE_FIRING


def test_for_zero_fires_immediately_and_nan_never_matches() -> None:
    tracker = AlertTracker()
    rule = AlertRule(name="Now")
    assert tracker.update("r", rule, [({}, 1.0), ({"a": "1"}, float("nan"))], T0)[0].state == STATE_FIRING
    assert len(tracker.instances("r")) == 1
    tracker.remove_missing([])
    assert tracker.state("r") == STATE_INACTIVE
