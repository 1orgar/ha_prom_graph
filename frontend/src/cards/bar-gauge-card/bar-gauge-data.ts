import { ThresholdConfig } from '../../types';
import { getThresholdColor, resolveColor } from '../../utils/color';

/**
 * CSS background of a bar gauge fill, Grafana-like:
 * - basic: solid colour of the value
 * - gradient: threshold colours blended along the bar (up to the value)
 * - lcd: segmented bar, each segment coloured by the threshold at its position
 */
export function barBackground(
  mode: 'gradient' | 'basic' | 'lcd',
  value: number,
  min: number,
  max: number,
  thresholds: ThresholdConfig[],
  fallback: string
): { fill: string; color: string } {
  const color = thresholds.length ? getThresholdColor(value, thresholds) : fallback;
  if (mode === 'basic' || !thresholds.length || max <= min) {
    return { fill: color, color };
  }
  const span = max - min;
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - min) / span) * 100));
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  const valuePct = pct(value) || 1;

  if (mode === 'lcd') {
    const segments = 20;
    const stops: string[] = [];
    for (let i = 0; i < segments; i++) {
      const segValue = min + ((i + 0.5) / segments) * span;
      const c = getThresholdColor(segValue, sorted);
      const a = (i / segments) * 100;
      const b = ((i + 1) / segments) * 100;
      // 12% gap between segments
      stops.push(`${c} ${a}%`, `${c} ${b - 100 / segments * 0.12}%`, `transparent ${b - 100 / segments * 0.12}%`, `transparent ${b}%`);
    }
    // the fill element is `valuePct` wide; scale the pattern to the full bar
    return { fill: `linear-gradient(90deg, ${stops.join(', ')}) 0 0 / ${(100 / valuePct) * 100}% 100%`, color };
  }

  // gradient: colours at threshold positions, relative to the filled width
  const stops = sorted
    .map((t) => ({ at: pct(t.value), color: resolveColor(t.color)! }))
    .filter((s) => s.at <= valuePct)
    .map((s) => `${s.color} ${(s.at / valuePct) * 100}%`);
  if (stops.length < 2) return { fill: color, color };
  return { fill: `linear-gradient(90deg, ${stops.join(', ')}, ${color} 100%)`, color };
}
