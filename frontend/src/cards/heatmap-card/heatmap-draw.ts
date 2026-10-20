import { colorPosition, HeatmapModel, schemeColor } from './heatmap-data';
import { timeLabel } from '../../utils/time';

export const AXIS_H = 16;
const FONT = '10px sans-serif';
const MAX_LABEL_W = 110;

/** Width of the row label column: longest label (short `le` values -> narrow column). */
export function labelWidth(rows: string[], measure: (s: string) => number = (s) => s.length * 6): number {
  const longest = rows.reduce((m, r) => Math.max(m, measure(r)), 0);
  return Math.min(MAX_LABEL_W, Math.ceil(longest) + 8);
}

export interface DrawOptions {
  height: number;
  scheme: string;
  log: boolean;
  textColor: string;
  language?: string;
}

/** Draw the heatmap onto a canvas (row 0 = lowest bucket at the bottom). */
export function drawHeatmap(canvas: HTMLCanvasElement, m: HeatmapModel, o: DrawOptions): void {
  const width = canvas.clientWidth || 400;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = o.height * dpr;
  if (!canvas.parentElement?.classList.contains('fill')) canvas.style.height = `${o.height}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, o.height);

  ctx.font = FONT;
  const LABEL_W = labelWidth(m.rows, (t) => ctx.measureText(t).width);
  (canvas as any).__labelW = LABEL_W;
  const plotW = width - LABEL_W;
  const plotH = o.height - AXIS_H;
  const cw = plotW / m.times.length;
  const ch = plotH / m.rows.length;

  m.cells.forEach((row, r) => {
    const y = plotH - (r + 1) * ch;
    row.forEach((v, t) => {
      if (v === null) return;
      ctx.fillStyle = schemeColor(o.scheme, colorPosition(v, m.min, m.max, o.log));
      ctx.fillRect(LABEL_W + t * cw, y, Math.ceil(cw) + 0.5, Math.max(1, Math.ceil(ch) - 1));
    });
  });

  ctx.fillStyle = o.textColor;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  const every = Math.max(1, Math.ceil(12 / ch));
  m.rows.forEach((label, r) => {
    if (r % every) return;
    let text = label;
    while (text.length > 2 && ctx.measureText(text).width > LABEL_W - 8) text = text.slice(0, -2) + '…';
    ctx.fillText(text, 0, plotH - (r + 0.5) * ch);
  });

  ctx.textBaseline = 'top';
  const ticks = Math.min(5, m.times.length);
  for (let i = 0; i < ticks; i++) {
    const idx = ticks > 1 ? Math.round((i / (ticks - 1)) * (m.times.length - 1)) : 0;
    const label = timeLabel(m.times[idx], m.times[m.times.length - 1] - m.times[0], o.language);
    ctx.textAlign = i === 0 ? 'left' : i === ticks - 1 ? 'right' : 'center';
    ctx.fillText(label, LABEL_W + idx * cw, plotH + 3);
  }
}

/** Cell under the mouse -> [row, timeIndex] or null. */
export function hitTest(
  m: HeatmapModel,
  rect: { width: number; left: number; top: number },
  clientX: number,
  clientY: number,
  height: number,
  LABEL_W = labelWidth(m.rows)
): [number, number] | null {
  const x = clientX - rect.left - LABEL_W;
  const y = clientY - rect.top;
  const plotH = height - AXIS_H;
  if (x < 0 || y < 0 || y > plotH) return null;
  const t = Math.floor((x / (rect.width - LABEL_W)) * m.times.length);
  const r = m.rows.length - 1 - Math.floor((y / plotH) * m.rows.length);
  if (t < 0 || t >= m.times.length || r < 0 || r >= m.rows.length) return null;
  return [r, t];
}
