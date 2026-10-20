import { PrometheusResponse } from '../../types';
import { MAX_SERIES, parseRange } from '../../utils/series';
import { shortLabel } from '../../utils/format';
import { mapValue, MappedState } from '../../utils/mappings';
import { StateTimelineCardConfig } from './state-timeline-card-config';

export interface Segment extends MappedState {
  start: number;
  end: number;
}

export interface TimelineRow {
  label: string;
  segments: Segment[];
}

/** Points -> segments; a gap longer than 2 steps ends a segment (no data). */
function toSegments(
  points: [number, number | null][],
  step: number,
  end: number,
  distinct: number[],
  c: StateTimelineCardConfig
): Segment[] {
  const out: Segment[] = [];
  const merge = c.merge_values !== false;
  // real sample interval (points can be sparser than the requested step)
  let interval = Infinity;
  for (let i = 1; i < points.length; i++) interval = Math.min(interval, points[i][0] - points[i - 1][0]);
  step = Number.isFinite(interval) ? Math.max(step, interval) : step;
  for (let i = 0; i < points.length; i++) {
    const [t, v] = points[i];
    if (v === null) continue;
    const next = points[i + 1]?.[0];
    const segEnd = next !== undefined && next - t <= step * 2 ? next : Math.min(t + step, end);
    const mapped = mapValue(v, c, distinct);
    const prev = out[out.length - 1];
    if (merge && prev && prev.key === mapped.key && prev.end >= t) {
      prev.end = segEnd;
    } else {
      out.push({ ...mapped, start: t, end: segEnd });
    }
  }
  return out;
}

/** One row per returned series; row label from `legend_format` (`{{label}}`). */
export function buildTimeline(
  res: PrometheusResponse | null,
  c: StateTimelineCardConfig,
  step: number,
  end: number
): TimelineRow[] {
  const template = c.legend_format?.trim() || undefined;
  const raw = parseRange(res, template).map((s) => ({
    label: shortLabel(s.metric, template),
    points: s.points
  }));

  const distinct = Array.from(
    new Set(raw.flatMap((r) => r.points.map((p) => p[1]).filter((v): v is number => v !== null)))
  ).sort((a, b) => a - b);

  return raw.slice(0, MAX_SERIES).map((r) => ({
    label: r.label,
    segments: toSegments(r.points, step, end, distinct, c)
  }));
}
