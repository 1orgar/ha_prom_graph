import { PrometheusResponse } from '../../types';
import { parseInstant } from '../../utils/series';

export interface TableRow {
  labels: Record<string, string>;
  value: number | null;
}

export interface TableModel {
  columns: string[];
  rows: TableRow[];
}

/** Columns: explicit list, or every label present in the result (without __name__ unless it differs). */
export function buildTable(
  res: PrometheusResponse | null | undefined,
  opts: { columns?: string[]; hide?: string[]; sortBy?: 'value' | 'label'; sortDir?: 'asc' | 'desc'; maxRows?: number }
): TableModel {
  const series = parseInstant(res);
  const hide = new Set(opts.hide || []);
  let columns: string[];
  if (opts.columns && opts.columns.length) {
    columns = opts.columns.filter((c) => !hide.has(c));
  } else {
    const all = new Set<string>();
    for (const s of series) Object.keys(s.metric).forEach((k) => all.add(k));
    const names = new Set(series.map((s) => s.metric.__name__));
    // a single metric name in every row is noise
    if (names.size <= 1) all.delete('__name__');
    columns = [...all].filter((c) => !hide.has(c)).sort((a, b) => (a === '__name__' ? -1 : b === '__name__' ? 1 : a.localeCompare(b)));
  }

  const rows: TableRow[] = series.map((s) => ({ labels: s.metric, value: s.value }));
  const dir = opts.sortDir === 'asc' ? 1 : -1;
  if (opts.sortBy === 'label' && columns.length) {
    const key = columns[0];
    rows.sort((a, b) => dir * -1 * (a.labels[key] ?? '').localeCompare(b.labels[key] ?? '', undefined, { numeric: true }));
  } else {
    rows.sort((a, b) => dir * ((a.value ?? -Infinity) - (b.value ?? -Infinity)));
  }
  return { columns, rows: opts.maxRows ? rows.slice(0, opts.maxRows) : rows };
}
