import type { PrometheusAlert } from '../../prometheus-client';

export interface AlertFilter {
  states?: string[];        // default: firing + pending
  severities?: string;      // comma separated, empty = all
  name_filter?: string;     // substring / regex on alertname
  /** firing window: show an alert only after it is active this long (`5m`, `1h`, seconds) */
  min_active?: string;
  /** `prometheus` = rules of the server, `local` = PromQL alerts of Home Assistant, empty = both */
  source?: 'prometheus' | 'local' | '';
}

export interface AlertGroup {
  alert: PrometheusAlert;   // representative (most severe / oldest) alert
  count: number;            // number of series of the alert
}

/** `5m`, `1h30m`, `90` (seconds) -> seconds; invalid / empty -> 0. */
export function durationSeconds(v?: string | number): number {
  if (v === undefined || v === null || v === '') return 0;
  if (typeof v === 'number') return Math.max(0, v);
  const s = String(v).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  const mult: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 };
  let total = 0;
  let matched = '';
  for (const m of s.matchAll(/(\d+(?:\.\d+)?)([smhdw])/g)) {
    total += parseFloat(m[1]) * mult[m[2]];
    matched += m[0];
  }
  return matched === s.replace(/\s+/g, '') ? total : 0;
}

/** Seconds since `activeAt` (0 if unknown). */
export function activeFor(a: PrometheusAlert, now = Date.now()): number {
  const t = a.activeAt ? Date.parse(a.activeAt) : NaN;
  return Number.isNaN(t) ? 0 : Math.max(0, (now - t) / 1000);
}

/** One row per alert name (all series of an alert collapsed, with the number of series). */
export function groupAlerts(alerts: PrometheusAlert[]): AlertGroup[] {
  const groups = new Map<string, AlertGroup>();
  for (const a of alerts) {
    const key = a.labels.alertname || '';
    const g = groups.get(key);
    if (g) g.count++;
    else groups.set(key, { alert: a, count: 1 });
  }
  return [...groups.values()];
}

const SEVERITY_ORDER: Record<string, number> = { critical: 0, error: 1, warning: 2, info: 3, none: 4 };
const STATE_ORDER: Record<string, number> = { firing: 0, pending: 1, inactive: 2 };

/** Filter and sort alerts: firing first, then by severity, then newest first. */
export function filterAlerts(alerts: PrometheusAlert[], f: AlertFilter, now = Date.now()): PrometheusAlert[] {
  const minActive = durationSeconds(f.min_active);
  const states = new Set(f.states?.length ? f.states : ['firing', 'pending']);
  const severities = (f.severities || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  let nameRe: RegExp | undefined;
  if (f.name_filter?.trim()) {
    try {
      nameRe = new RegExp(f.name_filter.trim(), 'i');
    } catch {
      const needle = f.name_filter.trim().toLowerCase();
      nameRe = { test: (s: string) => s.toLowerCase().includes(needle) } as RegExp;
    }
  }
  return alerts
    .filter((a) => states.has(a.state))
    .filter((a) => !severities.length || severities.includes((a.labels.severity || '').toLowerCase()))
    .filter((a) => !nameRe || nameRe.test(a.labels.alertname || ''))
    .filter((a) => !f.source || (f.source === 'local') === (a.source === 'home_assistant'))
    // firing window: inactive alerts have no activeAt and are not affected
    .filter((a) => !minActive || a.state === 'inactive' || activeFor(a, now) >= minActive)
    .sort(
      (a, b) =>
        (STATE_ORDER[a.state] ?? 9) - (STATE_ORDER[b.state] ?? 9) ||
        (SEVERITY_ORDER[(a.labels.severity || 'none').toLowerCase()] ?? 5) -
          (SEVERITY_ORDER[(b.labels.severity || 'none').toLowerCase()] ?? 5) ||
        (b.activeAt || '').localeCompare(a.activeAt || '')
    );
}

export function severityColor(severity?: string): string {
  switch ((severity || '').toLowerCase()) {
    case 'critical':
    case 'error':
      return '#F2495C';
    case 'warning':
      return '#FF9830';
    case 'info':
      return '#5794F2';
    default:
      return '#8E8E8E';
  }
}

/** "5m", "2h 3m", "3d 4h" since `iso`. */
export function since(iso: string | undefined, now = Date.now()): string {
  if (!iso) return '';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  let s = Math.max(0, Math.floor((now - t) / 1000));
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  return `${m}m`;
}
