/**
 * Dashboard variables (Grafana-like `$instance`, `${job}`), set by the variables card.
 *
 * Values live in a page-wide store (per browser tab, remembered in localStorage) and are
 * substituted into the queries of every Prometheus card before they are sent. A change
 * fires `prometheus-variables-changed` on `window`; cards using a changed variable refetch.
 */

export const VARIABLES_EVENT = 'prometheus-variables-changed';
/** value meaning "all values" (multi select with nothing chosen / include_all) */
export const ALL_VALUE = '$__all';
const STORAGE_KEY = 'prometheus-cards-variables';

export type VariableValue = string | string[];

interface Store {
  values: Record<string, VariableValue>;
  /** all known values of a variable (for `$__all`) */
  options: Record<string, string[]>;
}

const g = globalThis as unknown as { __PROM_CARDS_VARS__?: Store };

/** localStorage of the browser (not touched outside a browser, e.g. in unit tests). */
const storage = (): Storage | undefined => (typeof window === 'undefined' ? undefined : window.localStorage);

function store(): Store {
  if (!g.__PROM_CARDS_VARS__) {
    let values: Record<string, VariableValue> = {};
    try {
      values = JSON.parse(storage()?.getItem(STORAGE_KEY) || '{}') || {};
    } catch {
      values = {};
    }
    g.__PROM_CARDS_VARS__ = { values, options: {} };
  }
  return g.__PROM_CARDS_VARS__;
}

/** Current values (`$__all` resolved to the list of known options). */
export function dashboardVariables(): Record<string, VariableValue> {
  const s = store();
  const out: Record<string, VariableValue> = {};
  for (const [name, value] of Object.entries(s.values)) {
    const list = Array.isArray(value) ? value : [value];
    out[name] = list.includes(ALL_VALUE) ? s.options[name] || [] : value;
  }
  return out;
}

export function getVariable(name: string): VariableValue | undefined {
  return store().values[name];
}

export function setVariableOptions(name: string, options: string[]): void {
  store().options[name] = options;
}

/** Set values (without event when unchanged); fires VARIABLES_EVENT with the changed names. */
export function setVariables(values: Record<string, VariableValue>): void {
  const s = store();
  const changed = Object.keys(values).filter((k) => JSON.stringify(s.values[k]) !== JSON.stringify(values[k]));
  if (!changed.length) return;
  s.values = { ...s.values, ...values };
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(s.values));
  } catch {
    /* private mode */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(VARIABLES_EVENT, { detail: { names: changed } }));
  }
}

/** Regex-escape a label value for `=~` matchers. */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Format of a value inside a query. Several values (multi select) become a regex alternation,
 * so they work with `label=~"$var"`; one value is inserted as is (escaped for regex when it
 * stands in a `=~` / `!~` matcher).
 */
function format(value: VariableValue, regex: boolean): string {
  const list = Array.isArray(value) ? value : [value];
  if (list.length === 1 && !regex) return list[0];
  if (!list.length) return '.*';
  return list.map(escapeRegex).join('|');
}

const VAR_RE = /\$\{(\w+)\}|\$(\w+)/g;

/** Replace `$name` and `${name}` of known variables; unknown ones (e.g. `$__interval`) stay. */
export function expandVariables(query: string, vars: Record<string, VariableValue>): string {
  if (!query.includes('$')) return query;
  return query.replace(VAR_RE, (match, braced: string | undefined, plain: string | undefined, offset: number) => {
    const name = braced || plain!;
    if (!(name in vars)) return match;
    // inside `=~"..."` / `!~"..."`: values must be regex-escaped
    const before = query.slice(0, offset);
    const regex = /[=!]~\s*"[^"]*$/.test(before);
    return format(vars[name], regex);
  });
}

/** Names of the variables used in a query. */
export function variableNames(query: string): string[] {
  const names = new Set<string>();
  for (const m of query.matchAll(VAR_RE)) names.add(m[1] || m[2]);
  return [...names];
}

export function usesVariables(query: string, names: string[]): boolean {
  if (!query.includes('$') || !names.length) return false;
  const used = variableNames(query);
  return names.some((n) => used.includes(n));
}
