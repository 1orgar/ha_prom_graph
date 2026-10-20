import type { BaseCardConfig, SeriesConfig } from '../types';

/**
 * Normalise configs written by older versions (read-only compatibility):
 * - `name` -> `title` (every panel has the same title field and look)
 * - `series: [{ query, name }]` (v0.2-v0.5, several queries per panel) -> one `query` + `legend_format`.
 *   Since v0.6 a panel has exactly one query; extra queries of old configs are dropped
 *   (combine them in PromQL, e.g. `a or b`, if needed).
 */
export function migrateConfig<C extends BaseCardConfig>(config: C): C {
  const c: Record<string, any> = { ...config };
  if (!c.title && typeof c.name === 'string' && c.name.trim()) {
    c.title = c.name;
  }
  delete c.name;

  const series = Array.isArray(c.series) ? (c.series as SeriesConfig[]).filter((s) => s?.query?.trim()) : [];
  if (series.length) {
    if (!c.query?.trim()) {
      c.query = series[0].query;
      if (!c.legend_format && series[0].name) c.legend_format = series[0].name;
      if (series[0].fill && c.fill === undefined) c.fill = true;
    }
    if (series.length > 1 || (config.query && series.length)) {
      // eslint-disable-next-line no-console
      console.warn(`prometheus-cards: ${config.type}: only one query per panel is supported, extra queries ignored`);
    }
  }
  delete c.series;
  return c as C;
}

/** Sections view rows (56px + 8px gap) needed for a panel height in px. */
export function rowsForHeight(px: number): number {
  return Math.max(1, Math.ceil((px + 8) / 64));
}
