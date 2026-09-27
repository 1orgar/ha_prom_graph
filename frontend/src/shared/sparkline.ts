import { LitElement, html, css, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('prometheus-sparkline')
export class Sparkline extends LitElement {
  @property({ type: Array }) data: number[] = [];
  @property({ type: String }) color: string = 'var(--primary-color)';
  @property({ type: Boolean }) fill: boolean = false;
  @property({ type: Number }) height: number = 40;
  @property({ type: String }) width: string = '100%';

  static styles = css`
    :host {
      display: block;
    }
    svg {
      display: block;
      overflow: visible;
    }
    .line {
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .area {
      stroke: none;
    }
  `;

  render() {
    if (!this.data || this.data.length === 0) {
      return html``;
    }

    const min = Math.min(...this.data);
    const max = Math.max(...this.data);
    const range = max - min || 1;

    const points = this.data.map((val, i) => {
      const x = (i / (this.data.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    const fillPoints = `0,100 ${points} 100,100`;

    return html`
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style="height: ${this.height}px; width: ${this.width};"
      >
        ${this.fill ? svg`
          <defs>
            <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${this.color}" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${this.color}" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <polygon points="${fillPoints}" fill="url(#fillGrad)" class="area"></polygon>
        ` : ''}
        <polyline points="${points}" stroke="${this.color}" class="line"></polyline>
      </svg>
    `;
  }
}
