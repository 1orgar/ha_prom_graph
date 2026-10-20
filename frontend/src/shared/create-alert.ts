import { HomeAssistant, ThresholdConfig } from '../types';

/** Prefill of the "Create alert" form of the query editor (from the card config). */
export interface AlertDraft {
  name: string;
  condition: string;
  threshold?: number;
  for: string;
  severity: string;
}

export const ALERT_CONDITIONS = ['gt', 'gte', 'lt', 'lte', 'eq', 'ne', 'any'];
export const CONDITION_LABELS: Record<string, string> = {
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  eq: '=',
  ne: '≠',
  any: '∃'
};
export const ALERT_SEVERITIES = ['critical', 'warning', 'info'];

/**
 * Alert from a card: name = panel title, threshold = the first threshold above the base
 * (Grafana style: the lowest threshold is the base colour, the next one is "bad").
 */
export function alertDraft(config: { title?: string; name?: string; thresholds?: ThresholdConfig[] } | undefined): AlertDraft {
  const steps = [...(config?.thresholds || [])]
    .filter((t) => typeof t.value === 'number' && Number.isFinite(t.value))
    .sort((a, b) => a.value - b.value);
  const threshold = steps.length > 1 ? steps[1].value : steps[0]?.value;
  return {
    name: config?.title || config?.name || '',
    condition: threshold === undefined ? 'any' : 'gt',
    threshold,
    for: '5m',
    severity: 'warning'
  };
}

/** Admins only (backend checks too); unknown user (old frontends, demo) = allowed. */
export function canCreateAlerts(hass?: HomeAssistant): boolean {
  return hass?.user?.is_admin !== false;
}
