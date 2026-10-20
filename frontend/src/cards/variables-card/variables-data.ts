import { PrometheusResponse } from '../../types';
import { ALL_VALUE, VariableValue } from '../../utils/variables';

export interface VariableConfig {
  /** used in queries as `$name` / `${name}` */
  name: string;
  label?: string;
  /** values = distinct values of `label_name` in the result of `query` (like Grafana `label_values`) */
  query?: string;
  label_name?: string;
  /** fixed values (instead of a query), e.g. ["5m", "1h"] */
  values?: string[];
  multi?: boolean;
  /** "All" option: every value (regex alternation in `=~` matchers) */
  include_all?: boolean;
  default?: string;
  /** optional regex to filter / capture values (first group is used) */
  regex?: string;
}

/** Distinct, naturally sorted values of a label in an instant query result. */
export function labelValues(res: PrometheusResponse | null, label: string, regex?: string): string[] {
  const out = new Set<string>();
  let re: RegExp | undefined;
  try {
    re = regex ? new RegExp(regex) : undefined;
  } catch {
    re = undefined;
  }
  for (const r of res?.data?.result || []) {
    let v = r.metric?.[label];
    if (v === undefined || v === '') continue;
    if (re) {
      const m = re.exec(v);
      if (!m) continue;
      v = m[1] ?? m[0];
    }
    out.add(v);
  }
  return [...out].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/** Label used for the values of a query variable: `label_name`, or the only label of the result. */
export function guessLabel(res: PrometheusResponse | null, v: VariableConfig): string | undefined {
  if (v.label_name) return v.label_name;
  const names = new Set<string>();
  for (const r of res?.data?.result || []) Object.keys(r.metric || {}).forEach((k) => k !== '__name__' && names.add(k));
  return names.size === 1 ? [...names][0] : names.has(v.name) ? v.name : undefined;
}

/**
 * Keep a valid value after the option list changed: the stored value if it still exists,
 * else the configured default, else "All" (include_all) or the first option.
 */
export function resolveValue(v: VariableConfig, options: string[], current: VariableValue | undefined): VariableValue {
  const known = (x: string) => options.includes(x) || (v.include_all && x === ALL_VALUE);
  if (current !== undefined) {
    const list = (Array.isArray(current) ? current : [current]).filter(known);
    if (list.length) return v.multi ? list : list[0];
  }
  if (v.default !== undefined && known(v.default)) return v.multi ? [v.default] : v.default;
  if (v.include_all) return v.multi ? [ALL_VALUE] : ALL_VALUE;
  if (!options.length) return v.multi ? [] : '';
  return v.multi ? [options[0]] : options[0];
}
