import { PrometheusResponse, ThresholdConfig } from '../../types';
import { shortLabel } from '../../utils/format';
import { getThresholdColor, GRAFANA_CLASSIC, stepColor } from '../../utils/color';
import { itemColor, parseInstant } from '../../utils/series';
import { BarChartCardConfig } from './bar-chart-card-config';

export interface BarData {
  label: string;
  value: number;
  color: string;
}

/** Instant result -> sorted, limited and coloured bars (one per series). */
export function buildBars(res: PrometheusResponse | null, c: BarChartCardConfig): { bars: BarData[]; max: number } {
  let bars: BarData[] = parseInstant(res, c.legend_format)
    .filter((s) => s.value !== null)
    .map((s) => ({ label: shortLabel(s.metric, c.legend_format), value: s.value!, color: '' }));

  const sort = c.sort || 'desc';
  if (sort === 'desc') bars.sort((a, b) => b.value - a.value);
  else if (sort === 'asc') bars.sort((a, b) => a.value - b.value);
  else if (sort === 'name') bars.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
  if (c.limit && c.limit > 0) bars = bars.slice(0, c.limit);

  const byThreshold = c.color_mode !== 'series' && c.thresholds?.length;
  bars.forEach((d, i) => {
    const palette = itemColor(i, bars.length, c.palette);
    d.color = byThreshold ? getThresholdColor(d.value, c.thresholds!, palette) : palette;
  });
  const maxVal = bars.reduce((m, d) => Math.max(m, d.value), 0);
  return { bars, max: c.max || maxVal || 100 };
}

/**
 * Gradient fill by thresholds: threshold colours blended along the whole scale (0..max, like a
 * Grafana bar gauge), so a bar shows the colours up to its value. `null` when there is nothing to blend.
 * The fill element is `pct`% of the track: the gradient is scaled to the full track length.
 */
export function gradientFill(
  thresholds: ThresholdConfig[] | undefined,
  max: number,
  pct: number,
  vertical: boolean
): string | null {
  if (!thresholds || thresholds.length < 2 || pct <= 0 || !(max > 0)) return null;
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  const at = (v: number) => Math.max(0, Math.min(100, (v / max) * 100));
  const stops = sorted.map((t, i) => {
    const color = stepColor(t) || GRAFANA_CLASSIC[0];
    // the base step starts the gradient, the others blend in at their value
    return `${color} ${i === 0 ? 0 : at(t.value).toFixed(2)}%`;
  });
  const size = `${((100 / pct) * 100).toFixed(2)}%`;
  return vertical
    ? `linear-gradient(0deg, ${stops.join(', ')}) left bottom / 100% ${size} no-repeat`
    : `linear-gradient(90deg, ${stops.join(', ')}) left top / ${size} 100% no-repeat`;
}

/** Fill of a bar in percent of the track (0..100). */
export function barPercent(value: number, max: number): number {
  return Math.min(100, Math.max(0, (value / (max || 1)) * 100));
}
