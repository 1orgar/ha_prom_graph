import { ThresholdConfig } from '../types';

/**
 * Grafana "classic" palette (the default palette of Grafana time series).
 * Chosen for good contrast between neighbours and on dark/light themes.
 */
export const GRAFANA_CLASSIC = [
  '#7EB26D', '#EAB839', '#6ED0E0', '#EF843C', '#E24D42', '#1F78C1', '#BA43A9', '#705DA0',
  '#508642', '#CCA300', '#447EBC', '#C15C17', '#890F02', '#0A437C', '#6D1F62', '#584477',
  '#B7DBAB', '#F4D598', '#70DBED', '#F9BA8F', '#F29191', '#82B5D8', '#E5A8E2', '#AEA2E0',
  '#629E51', '#E5AC0E', '#64B0C8', '#E0752D', '#BF1B00', '#0A50A1', '#962D82', '#614D93',
  '#9AC48A', '#F2C96D', '#65C5DB', '#F9934E', '#EA6460', '#5195CE', '#D683CE', '#806EB7'
];

/** Grafana "palette-classic" named base colours used in threshold pickers. */
export const GRAFANA_NAMED: Record<string, string> = {
  green: '#73BF69',
  yellow: '#FADE2A',
  orange: '#FF9830',
  red: '#F2495C',
  blue: '#5794F2',
  purple: '#B877D9',
  'dark-green': '#37872D',
  'dark-red': '#C4162A',
  text: 'var(--primary-text-color)'
};

export type PaletteName = 'classic' | 'green-yellow-red' | 'blues' | 'greens' | 'reds' | 'purples';

// Continuous "by series" palettes from Grafana (sampled)
const SCHEMES: Record<Exclude<PaletteName, 'classic'>, string[]> = {
  'green-yellow-red': ['#73BF69', '#A0D468', '#FADE2A', '#FFB357', '#FF9830', '#F2495C'],
  blues: ['#C0D8FF', '#8AB8FF', '#5794F2', '#3274D9', '#1F60C4'],
  greens: ['#C8F2C2', '#96D98D', '#73BF69', '#56A64B', '#37872D'],
  reds: ['#FFA6B0', '#FF7383', '#F2495C', '#E02F44', '#C4162A'],
  purples: ['#DEB6F2', '#CA95E5', '#B877D9', '#A352CC', '#8F3BB8']
};

/** Kept for backward compatibility. */
export const DEFAULT_SERIES_COLORS = GRAFANA_CLASSIC;

export function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  return GRAFANA_NAMED[color] || color;
}

/** Colour of the n-th series for the chosen palette. */
export function paletteColor(index: number, total: number, palette: PaletteName = 'classic'): string {
  if (palette === 'classic' || !SCHEMES[palette]) {
    return GRAFANA_CLASSIC[index % GRAFANA_CLASSIC.length];
  }
  const scheme = SCHEMES[palette];
  if (total <= 1) return scheme[Math.floor(scheme.length / 2)];
  const pos = (index / (total - 1)) * (scheme.length - 1);
  return scheme[Math.round(pos)];
}

/** Colour of a threshold / mapping; `transparent: true` wins over the colour. */
export function stepColor(t: { color?: string; transparent?: boolean }): string | undefined {
  return t.transparent ? 'transparent' : resolveColor(t.color);
}

export function getThresholdColor(value: number, thresholds: ThresholdConfig[], fallback?: string): string {
  if (!thresholds || thresholds.length === 0) {
    return fallback || GRAFANA_CLASSIC[0];
  }
  const sorted = [...thresholds].sort((a, b) => b.value - a.value);
  for (const t of sorted) {
    if (value >= t.value) {
      return stepColor(t) || fallback || GRAFANA_CLASSIC[0];
    }
  }
  return stepColor(sorted[sorted.length - 1]) || fallback || GRAFANA_CLASSIC[0];
}

/** `#rrggbb` + alpha -> `#rrggbbaa` (other formats returned unchanged). */
export function withAlpha(color: string, alpha: number): string {
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color + Math.round(alpha * 255).toString(16).padStart(2, '0');
  }
  return color;
}
