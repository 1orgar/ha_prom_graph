import { html, css, nothing, PropertyValues } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { BaseCardConfig } from '../../types';
import { buildHeatmap, HEATMAP_SCHEMES, HeatmapModel, isRawCounterQuery } from './heatmap-data';
import { drawHeatmap, hitTest } from './heatmap-draw';
import { formatValue } from '../../utils/format';
import { rangeWindow } from '../../utils/time';
import { localize } from '../../localize';
import './heatmap-card-editor';

export interface HeatmapCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-heatmap-card';
  time_range?: string;
  heatmap_mode?: 'histogram' | 'series';
  color_scheme?: keyof typeof HEATMAP_SCHEMES;
  log_scale?: boolean;
  height?: number;          // chart height px when the panel height is auto, default 200
  show_legend_scale?: boolean;
  /** raw `_bucket` counters: convert to increases (`auto` detects queries without rate/increase) */
  counters?: 'auto' | 'yes' | 'no';
}

@customElement('prometheus-heatmap-card')
export class HeatmapCard extends BasePrometheusCard<HeatmapCardConfig> {
  @state() private _model?: HeatmapModel;
  @state() private _hover = '';
  @query('canvas') private _canvas?: HTMLCanvasElement;
  private _resize?: ResizeObserver;

  static get styles() {
    return [
      cardStyles,
      css`
        .plot { position: relative; }
        .plot.fill { flex: 1 1 auto; min-height: 60px; }
        canvas { width: 100%; display: block; }
        .plot.fill canvas { position: absolute; inset: 0; height: 100%; }
        .foot { display: flex; justify-content: space-between; align-items: center; gap: 8px;
          font-size: 11px; color: var(--secondary-text-color); min-height: 16px; }
        .scale { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
        .bar { width: 120px; height: 8px; border-radius: 4px; }
      `
    ];
  }

  static getStubConfig(): Partial<HeatmapCardConfig> {
    return {
      type: 'custom:prometheus-heatmap-card',
      title: 'Request duration',
      query: 'sum by (le) (rate(prometheus_http_request_duration_seconds_bucket[5m]))',
      heatmap_mode: 'histogram',
      time_range: '6h'
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-heatmap-card-editor');
  }

  protected _defaultColumns(): number {
    return 12;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resize?.disconnect();
    this._resize = undefined;
  }

  protected async _fetchData(): Promise<void> {
    const c = this._config;
    try {
      this._loading = true;
      const { start, end, step } = rangeWindow(c.time_range || '6h', 120);
      const res = await this._client.rangeQuery(c.query!, start, end, step);
      const counters = c.counters === 'yes' || ((c.counters || 'auto') === 'auto' && isRawCounterQuery(c.query));
      this._model = buildHeatmap(res, c.heatmap_mode || 'histogram', c.legend_format, counters);
      this._error = undefined;
    } catch (e: any) {
      this._error = this._formatError(e);
    } finally {
      this._loading = false;
    }
  }

  protected updated(changed: PropertyValues) {
    super.updated(changed);
    if (this._canvas && !this._resize && typeof ResizeObserver !== 'undefined') {
      this._resize = new ResizeObserver(() => this._draw());
      this._resize.observe(this._canvas.parentElement || this._canvas);
    }
    if (changed.has('_model') || changed.has('_config')) this._draw();
  }

  private _draw() {
    const m = this._model;
    if (!m || !this._canvas || !m.times.length || !m.rows.length) return;
    drawHeatmap(this._canvas, m, {
      height: this._plotHeight(),
      scheme: this._config.color_scheme || 'oranges',
      log: Boolean(this._config.log_scale),
      textColor: getComputedStyle(this).getPropertyValue('--secondary-text-color').trim() || '#888',
      language: this._hass?.locale?.language
    });
  }

  private _plotHeight(): number {
    const parent = this._canvas?.parentElement;
    if (this._fixedHeight() && parent?.clientHeight) return Math.max(60, parent.clientHeight);
    return this._config.height || 200;
  }

  private _onMove(ev: MouseEvent) {
    const m = this._model;
    if (!m || !this._canvas) return;
    const hit = hitTest(m, this._canvas.getBoundingClientRect(), ev.clientX, ev.clientY, this._plotHeight(), (this._canvas as any).__labelW);
    if (!hit) {
      this._hover = '';
      return;
    }
    const [r, t] = hit;
    const v = m.cells[r][t];
    const time = new Date(m.times[t] * 1000).toLocaleString(this._hass?.locale?.language);
    const row = (this._config.heatmap_mode || 'histogram') === 'histogram' ? `le ${m.rows[r]}` : m.rows[r];
    this._hover = `${row} · ${time} · ${v === null ? '-' : formatValue(v, this._config.decimals, this._config.unit)}`;
  }

  render() {
    const c = this._config;
    if (!this._hasQuery()) return this.renderPlaceholder();
    if (this._error) return this.renderError();
    if (!this._model) return this.renderLoading();
    const m = this._model;
    const stops = (HEATMAP_SCHEMES[c.color_scheme || 'oranges'] || HEATMAP_SCHEMES.oranges).join(', ');
    return html`
      <ha-card>
        ${this.renderHeader()}
        ${m.times.length && m.rows.length
          ? html`<div class="plot ${this._fixedHeight() ? 'fill' : ''}">
                <canvas @mousemove=${this._onMove} @mouseleave=${() => (this._hover = '')}></canvas>
              </div>
              <div class="foot">
                <span>${this._hover}</span>
                ${c.show_legend_scale !== false
                  ? html`<span class="scale">${formatValue(m.min, c.decimals, c.unit)}
                      <span class="bar" style="background:linear-gradient(90deg, ${stops})"></span>
                      ${formatValue(m.max, c.decimals, c.unit)}</span>`
                  : nothing}
              </div>`
          : html`<div class="placeholder-state">${localize('no_data', this._hass)}</div>`}
      </ha-card>
    `;
  }
}
