/** Duration like `90s`, `15m`, `6h`, `7d`, `2w` -> seconds (NaN if invalid). */
export function parseDuration(range: string): number {
  const match = String(range).trim().match(/^(\d+)([smhdw])$/);
  if (!match) return NaN;
  const val = parseInt(match[1], 10);
  const mult: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 };
  return val * mult[match[2]];
}

/**
 * Time window ending now. `align` rounds start/end down to a multiple of it,
 * so range queries of different cards (and tabs) are identical and can be
 * served by one backend request / cache entry.
 */
export function parseTimeRange(range: string, align = 0, now = Date.now()): { start: number; end: number } {
  const seconds = parseDuration(range);
  let end = Math.floor(now / 1000);
  if (align > 1) end = Math.floor(end / align) * align;
  const start = end - (Number.isFinite(seconds) ? seconds : 3600);
  return { start, end };
}

/** Step in seconds for a window: ~`maxPoints` points, rounded to "nice" values. */
export function stepSeconds(start: number, end: number, maxPoints = 500): number {
  const raw = Math.max(1, (end - start) / maxPoints);
  const nice = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 10800, 21600, 43200, 86400];
  return nice.find((n) => n >= raw) ?? Math.ceil(raw / 86400) * 86400;
}

export function calculateStep(start: number, end: number, maxPoints: number = 500): string {
  return `${stepSeconds(start, end, maxPoints)}s`;
}

/**
 * Aligned query window for range queries: step is "nice" and start/end are
 * multiples of the step, so identical cards produce identical requests.
 */
export function rangeWindow(range: string, maxPoints = 500, now = Date.now()): { start: number; end: number; step: string } {
  const { start: s0, end: e0 } = parseTimeRange(range, 0, now);
  const step = stepSeconds(s0, e0, maxPoints);
  const { start, end } = parseTimeRange(range, step, now);
  return { start, end, step: `${step}s` };
}

/** One-line axis label: `HH:MM` (24h), `DD.MM HH:MM` for ranges over a day, `DD.MM` over 2 days. */
export function timeLabel(ts: number, span: number, language?: string): string {
  const d = new Date(ts * 1000);
  const time = d.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false });
  if (span <= 86400) return time;
  const date = d.toLocaleDateString(language, { day: '2-digit', month: '2-digit' });
  return span > 2 * 86400 ? date : `${date} ${time}`;
}

export function formatTimestamp(ts: number): string {
  const date = new Date(ts * 1000);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
