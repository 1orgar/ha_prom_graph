import { LitElement, html, css, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';

let _uid = 0;

export interface SparklineSeries {
  values: (number | null)[];
  color: string;
}

/**
 * Lightweight SVG sparkline. Supports several series sharing one Y scale.
 * `vector-effect: non-scaling-stroke` keeps the line width in real pixels.
 */
@customElement('prometheus-sparkline')
export class Sparkline extends LitElement {
  @property({ attribute: false }) series: SparklineSeries[] = [];
  @property({ type: Boolean }) fill = true;
  @property({ type: Number }) height = 40;
  @property({ type: Number, attribute: 'line-width' }) lineWidth = 2;

  private _id = `pspark-${++_uid}`;

  static styles = css`
    :host {
      display: block;
    }
    :host(.fill) {
      min-height: 24px;
    }
    svg {
      display: block;
      overflow: visible;
      width: 100%;
    }
    polyline {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
  `;

  render() {
    const all = this.series.flatMap((s) => s.values.filter((v): v is number => v !== null));
    if (!all.length) return html``;

    let min = Math.min(...all);
    let max = Math.max(...all);
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const range = max - min;
    // keep the stroke inside the box
    const pad = (this.lineWidth / 2 / this.height) * 100;

    const paths = this.series.map((s, idx) => {
      const n = s.values.length;
      const pts: string[] = [];
      s.values.forEach((v, i) => {
        if (v === null) return;
        const x = n > 1 ? (i / (n - 1)) * 100 : 50;
        const y = pad + (100 - 2 * pad) * (1 - (v - min) / range);
        pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
      });
      const gid = `${this._id}-${idx}`;
      const fill = this.fill && this.series.length === 1 && pts.length > 1;
      const first = pts[0]?.split(',')[0] ?? '0';
      const last = pts[pts.length - 1]?.split(',')[0] ?? '100';
      return svg`
        ${fill
          ? svg`
            <defs>
              <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${s.color}" stop-opacity="0.35"></stop>
                <stop offset="100%" stop-color="${s.color}" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
            <polygon points="${first},100 ${pts.join(' ')} ${last},100" fill="url(#${gid})" stroke="none"></polygon>`
          : ''}
        <polyline points="${pts.join(' ')}" stroke="${s.color}" stroke-width="${this.lineWidth}"></polyline>
      `;
    });

    // `fill` class on the host (fixed-height panel): stretch to the host height
    const style = this.classList.contains('fill') ? 'height: 100%' : `height: ${this.height}px`;
    return html`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style=${style}>${paths}</svg>`;
  }
}
