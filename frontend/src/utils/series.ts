import { PrometheusResponse, PaletteOption } from '../types';
import { formatLegend } from './format';
import { paletteColor, PaletteName, resolveColor } from './color';

export const MAX_SERIES = 100;

export interface InstantSeries {
  metric: Record<string, string>;
  label: string;
  value: number | null;
}

export interface RangeSeries {
  metric: Record<string, string>;
  label: string;
  points: [number, number | null][];
}

function num(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const v = parseFloat(raw);
  return Number.isFinite(v) ? v : null;
}

/** Instant query -> one entry per returned series (also handles scalar results). */
export function parseInstant(res: PrometheusResponse | null | undefined, legend?: string, fallback?: string): InstantSeries[] {
  const data = res?.data;
  if (!data) return [];
  if (data.resultType === 'scalar' || data.resultType === 'string') {
    const raw = (data.result as unknown as [number, string]) || [];
    return [{ metric: {}, label: fallback || 'Value', value: num(raw[1]) }];
  }
  return (data.result || []).slice(0, MAX_SERIES).map((r) => ({
    metric: r.metric || {},
    label: formatLegend(r.metric || {}, legend, fallback),
    value: num(r.value?.[1])
  }));
}

/** Range query -> one entry per returned series (`limit` = max series, default MAX_SERIES). */
export function parseRange(
  res: PrometheusResponse | null | undefined,
  legend?: string,
  fallback?: string,
  limit = MAX_SERIES
): RangeSeries[] {
  const result = res?.data?.result || [];
  return result.slice(0, limit).map((r) => ({
    metric: r.metric || {},
    label: formatLegend(r.metric || {}, legend, fallback),
    points: (r.values || []).map(([t, v]) => [Number(t), num(v)] as [number, number | null])
  }));
}

/** Last non-null value of a range series. */
export function lastValue(points: [number, number | null][]): number | null {
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i][1] !== null) return points[i][1];
  }
  return null;
}

export type ReduceMode = 'none' | 'sum' | 'avg' | 'min' | 'max';

export function reduceValues(values: (number | null)[], mode: ReduceMode): number | null {
  const nums = values.filter((v): v is number => v !== null);
  if (!nums.length) return null;
  switch (mode) {
    case 'sum':
      return nums.reduce((a, b) => a + b, 0);
    case 'avg':
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    case 'min':
      return Math.min(...nums);
    case 'max':
      return Math.max(...nums);
    default:
      return nums[0];
  }
}

/**
 * Colour of the i-th item: explicit colour > palette.
 * `single` palette uses the theme primary colour for every item.
 */
export function itemColor(index: number, total: number, palette?: PaletteOption, explicit?: string): string {
  if (explicit) return resolveColor(explicit)!;
  if (palette === 'single') return 'var(--primary-color)';
  return paletteColor(index, total, (palette || 'classic') as PaletteName);
}
