import type uPlot from 'uplot';
import { PrometheusResponse, PaletteOption } from '../../types';
import { itemColor, MAX_SERIES, parseRange } from '../../utils/series';

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  values: (number | null)[];
  stats: { last: number | null; min: number | null; max: number | null; mean: number | null };
}

export interface ChartData {
  times: number[];
  series: ChartSeries[];
}

function stats(values: (number | null)[]): ChartSeries['stats'] {
  let min: number | null = null;
  let max: number | null = null;
  let sum = 0;
  let n = 0;
  let last: number | null = null;
  for (const v of values) {
    if (v === null) continue;
    min = min === null ? v : Math.min(min, v);
    max = max === null ? v : Math.max(max, v);
    sum += v;
    n++;
    last = v;
  }
  return { last, min, max, mean: n ? sum / n : null };
}

/**
 * Range response of the panel query -> aligned chart data.
 * Every returned series becomes a line with its own palette colour and a
 * Grafana-like legend label (`legend_format`, default `metric{labels}`).
 */
export function buildChartData(res: PrometheusResponse | null, legend?: string, palette?: PaletteOption): ChartData {
  const parsed = parseRange(res, legend).slice(0, MAX_SERIES);
  const timeSet = new Set<number>();
  parsed.forEach((s) => s.points.forEach(([t]) => timeSet.add(t)));
  const times = Array.from(timeSet).sort((a, b) => a - b);
  const series = parsed.map((s, i) => {
    const map = new Map(s.points);
    const values = times.map((t) => (map.has(t) ? map.get(t)! : null));
    const label = s.label || `Series ${i + 1}`;
    return { key: `${i}:${label}`, label, color: itemColor(i, parsed.length, palette), values, stats: stats(values) };
  });
  return { times, series };
}

/** Cumulative sums for stacked mode (nulls are treated as 0 in the stack). */
export function stackValues(series: ChartSeries[], hidden: Set<string>): (number | null)[][] {
  const acc: number[] = [];
  return series.map((s) => {
    if (hidden.has(s.key)) return s.values.map(() => null);
    return s.values.map((v, i) => {
      acc[i] = (acc[i] || 0) + (v ?? 0);
      return v === null ? null : acc[i];
    });
  });
}

export function toAligned(data: ChartData, stacked: boolean, hidden: Set<string>): uPlot.AlignedData {
  const cols = stacked ? stackValues(data.series, hidden) : data.series.map((s) => s.values);
  return [data.times, ...cols] as uPlot.AlignedData;
}

/** Units displayed with 1024 multiples: axis steps must be nice in KiB / MiB, not in bytes. */
const IEC_UNITS = new Set(['bytes', 'bits', 'kbytes', 'mbytes', 'gbytes', 'binBps', 'binbps', 'KiBs', 'MiBs']);

export function unitBase(unit?: string): 1000 | 1024 {
  return unit && IEC_UNITS.has(unit) ? 1024 : 1000;
}

/**
 * "Nice" step (1, 2, 2.5, 5 x 10^n) for about `ticks` intervals over `span`.
 * `base` 1024: the step is nice in the displayed unit (e.g. 2 MiB, not 2097152 B -> 1.91 MiB).
 */
export function niceStep(span: number, ticks = 5, base: 1000 | 1024 = 1000): number {
  if (!(span > 0) || !Number.isFinite(span)) return 1;
  if (base === 1024 && span / ticks >= 1024) {
    const k = Math.floor(Math.log(span / ticks) / Math.log(1024));
    const scale = Math.pow(1024, k);
    return niceStep(span / scale, ticks) * scale;
  }
  const raw = span / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * mag;
}

/**
 * Y range. Without an explicit `min` the axis starts at a "nice" value at or below
 * the data minimum (0 for non-negative data that is close to 0), so the origin of the
 * axis always has a tick with a label - like Grafana.
 */
export function yRange(
  dmin: number | null,
  dmax: number | null,
  opts: { min?: number; max?: number; stacked?: boolean; ticks?: number; base?: 1000 | 1024 }
): [number, number] {
  let lo = dmin ?? 0;
  let hi = dmax ?? 1;
  if (opts.stacked) lo = Math.min(0, lo);
  if (opts.min !== undefined && opts.min !== null) lo = opts.min;
  if (opts.max !== undefined && opts.max !== null) hi = opts.max;
  if (hi < lo) [lo, hi] = [hi, lo];
  if (hi === lo) {
    const pad = Math.abs(hi) * 0.1 || 1;
    if (opts.min === undefined || opts.min === null) lo -= pad;
    if (opts.max === undefined || opts.max === null) hi += pad;
  }
  const step = niceStep(hi - lo, opts.ticks ?? 5, opts.base);
  if (opts.min === undefined || opts.min === null) {
    // non-negative data near zero: start at 0 (typical for rates, bytes, durations)
    lo = lo >= 0 && lo <= (hi - lo) * 0.5 ? 0 : Math.floor(lo / step) * step;
  }
  if (opts.max === undefined || opts.max === null) {
    hi = Math.ceil(hi / step) * step;
    if (hi === lo) hi = lo + step;
  }
  return [lo, hi];
}

/** Tick positions from `lo` to `hi` (inclusive) - the first one is the origin. */
export function yTicks(lo: number, hi: number, ticks = 5, base: 1000 | 1024 = 1000): number[] {
  const step = niceStep(hi - lo, ticks, base);
  const out: number[] = [];
  const first = Math.ceil(lo / step - 1e-9) * step;
  if (Math.abs(first - lo) > step * 1e-6) out.push(lo);
  for (let v = first; v <= hi + step * 1e-6 && out.length < 50; v += step) {
    out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  }
  return out;
}
