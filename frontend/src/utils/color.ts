import { ThresholdConfig } from '../types';

export const DEFAULT_SERIES_COLORS = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#F44336', // Red
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#E91E63', // Pink
  '#8BC34A', // Light Green
  '#FFC107', // Amber
  '#795548'  // Brown
];

export function getThresholdColor(value: number, thresholds: ThresholdConfig[]): string {
  if (!thresholds || thresholds.length === 0) {
    return DEFAULT_SERIES_COLORS[0];
  }
  
  // Sort descending by value
  const sorted = [...thresholds].sort((a, b) => b.value - a.value);
  
  for (const t of sorted) {
    if (value >= t.value) {
      return t.color;
    }
  }
  
  // Return first (lowest) if none match or a default fallback
  return sorted[sorted.length - 1].color || '#4CAF50';
}

export function interpolateColor(color1: string, color2: string, factor: number): string {
  // Simple hex interpolation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
