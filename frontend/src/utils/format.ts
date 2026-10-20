import { FormattedValue, UNITS, UnitDef, toFixed } from './units';

const BY_ID = new Map(UNITS.map((u) => [u.id, u]));

// Free-form values used by v0.2 configs
const ALIASES: Record<string, string> = {
  '%': 'percent',
  B: 'bytes',
  seconds: 's',
  'bytes/s': 'binBps'
};

export function getUnit(id?: string): UnitDef | undefined {
  if (!id) return undefined;
  return BY_ID.get(id) || BY_ID.get(ALIASES[id]);
}

/** Format a value; unknown unit ids are treated as a custom suffix. */
export function formatParts(value: number | null | undefined, unit?: string, decimals?: number): FormattedValue {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return { prefix: '', text: '-', suffix: '' };
  }
  const def = getUnit(unit);
  if (def) return def.fn(value, decimals);
  return { prefix: '', text: toFixed(value, decimals), suffix: unit ? ` ${unit}` : '' };
}

export function formatValue(value: number | null | undefined, decimals?: number, unit?: string): string {
  const f = formatParts(value, unit, decimals);
  return `${f.prefix}${f.text}${f.suffix}`;
}

/** Options for the ha-form select selector: "Category › Unit". */
export function unitSelectOptions(): { value: string; label: string }[] {
  return UNITS.map((u) => ({ value: u.id, label: `${u.category} › ${u.label}` }));
}

/**
 * Grafana-style legend label.
 * - `{{label}}` placeholders are replaced by label values (Prometheus legend format)
 * - without a template: `name{labels}` like Grafana's default
 * - `prefix` (series name from the card config) is prepended when there are many series
 */
export function formatLegend(
  metric: Record<string, string>,
  template?: string,
  fallback?: string
): string {
  if (template && template.trim()) {
    return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, key) => metric[key] ?? '');
  }
  const { __name__: name, ...labels } = metric;
  const entries = Object.entries(labels);
  if (!entries.length) {
    return fallback || name || 'Value';
  }
  const labelText = entries.map(([k, v]) => `${k}="${v}"`).join(', ');
  if (fallback) {
    return entries.length === 1 ? `${fallback} ${entries[0][1]}` : `${fallback} {${labelText}}`;
  }
  return name ? `${name}{${labelText}}` : `{${labelText}}`;
}

/** Short label for bars / gauges: the value of the most specific label. */
export function shortLabel(metric: Record<string, string>, template?: string, groupBy?: string): string {
  if (template && template.trim()) return formatLegend(metric, template);
  if (groupBy && metric[groupBy]) return metric[groupBy];
  const keys = Object.keys(metric).filter((k) => k !== '__name__');
  if (keys.length === 1) return metric[keys[0]];
  if (keys.length > 1) return formatLegend(metric);
  return metric.__name__ || 'Value';
}
