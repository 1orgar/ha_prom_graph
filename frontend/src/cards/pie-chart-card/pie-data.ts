import { PrometheusResponse, PaletteOption } from '../../types';
import { itemColor, parseInstant } from '../../utils/series';
import { shortLabel } from '../../utils/format';

export interface Slice {
  label: string;
  value: number;
  color: string;
  percent: number;
}

/** Instant result -> slices (one per series), top N + "Other". */
export function buildSlices(
  res: PrometheusResponse | null,
  legend: string | undefined,
  opts: { palette?: PaletteOption; sort?: 'desc' | 'asc' | 'none'; limit?: number; otherLabel: string }
): Slice[] {
  const template = legend?.trim() || undefined;
  let items: { label: string; value: number; explicit?: string }[] = [];
  for (const s of parseInstant(res, template)) {
    // negative / NaN values cannot be drawn as a slice
    if (s.value === null || s.value <= 0) continue;
    items.push({ label: shortLabel(s.metric, template), value: s.value });
  }

  const sort = opts.sort || 'desc';
  if (sort === 'desc') items.sort((a, b) => b.value - a.value);
  else if (sort === 'asc') items.sort((a, b) => a.value - b.value);

  if (opts.limit && opts.limit > 0 && items.length > opts.limit) {
    const rest = items.slice(opts.limit);
    items = items.slice(0, opts.limit);
    items.push({ label: opts.otherLabel, value: rest.reduce((a, b) => a + b.value, 0), explicit: '#8E8E8E' });
  }

  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  return items.map((it, i) => ({
    label: it.label,
    value: it.value,
    color: itemColor(i, items.length, opts.palette, it.explicit),
    percent: (it.value / total) * 100
  }));
}

function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  const a = ((angle - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** SVG path of a pie / donut slice in a 100x100 viewBox (angles in degrees, 0 = top). */
export function arcPath(start: number, end: number, outer: number, inner: number): string {
  // a full circle cannot be drawn with a single arc
  const sweep = Math.min(end - start, 359.999);
  const e = start + sweep;
  const large = sweep > 180 ? 1 : 0;
  const [x1, y1] = polar(50, 50, outer, start);
  const [x2, y2] = polar(50, 50, outer, e);
  if (inner <= 0) {
    return `M 50 50 L ${x1} ${y1} A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2} Z`;
  }
  const [x3, y3] = polar(50, 50, inner, e);
  const [x4, y4] = polar(50, 50, inner, start);
  return `M ${x1} ${y1} A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`;
}

export function labelPoint(start: number, end: number, radius: number): [number, number] {
  return polar(50, 50, radius, (start + end) / 2);
}
