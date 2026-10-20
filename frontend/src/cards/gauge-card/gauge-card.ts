import { html, nothing, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { formatParts, shortLabel } from '../../utils/format';
import { getThresholdColor } from '../../utils/color';
import { InstantSeries, itemColor, parseInstant } from '../../utils/series';
import { GaugeCardConfig } from './gauge-card-config';
import { gaugeStyles } from './gauge-card-styles';
import { localize } from '../../localize';
import './gauge-card-editor';

const RADIUS = 40;
const CIRCUMFERENCE = Math.PI * RADIUS;

@customElement('prometheus-gauge-card')
export class GaugeCard extends BasePrometheusCard<GaugeCardConfig> {
  @state() private _items: InstantSeries[] = [];
  @state() private _loaded = false;

  static get styles() {
    return [cardStyles, gaugeStyles];
  }

  static getStubConfig(): Partial<GaugeCardConfig> {
    return {
      type: 'custom:prometheus-gauge-card',
      title: 'Prometheus targets up',
      query: 'avg(up) * 100',
      unit: 'percent',
      min: 0,
      max: 100,
      decimals: 0,
      thresholds: [
        { value: 0, color: '#F2495C' },
        { value: 50, color: '#FADE2A' },
        { value: 90, color: '#73BF69' }
      ]
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-gauge-card-editor');
  }

  protected async _fetchData() {
    try {
      this._loading = true;
      const res = await this._client.instantQuery(this._config.query!);
      this._items = parseInstant(res, this._config.legend_format).map((s) => ({
        ...s,
        label: shortLabel(s.metric, this._config.legend_format)
      }));
      this._error = undefined;
    } catch (e: any) {
      this._error = this._formatError(e);
    } finally {
      this._loading = false;
      this._loaded = true;
    }
  }

  private _color(value: number | null, index: number, total: number): string {
    const c = this._config;
    if (c.color_mode === 'series' || (!c.thresholds?.length && total > 1)) {
      return itemColor(index, total, c.palette);
    }
    return getThresholdColor(value ?? c.min ?? 0, c.thresholds || [], itemColor(index, total, c.palette));
  }

  private _renderGauge(item: InstantSeries, index: number, total: number) {
    const c = this._config;
    const min = c.min ?? 0;
    const max = c.max ?? 100;
    const arcWidth = c.arc_width ?? 8;
    const val = item.value ?? min;
    const clamped = Math.min(Math.max(val, min), max);
    const fraction = max > min ? (clamped - min) / (max - min) : 0;
    const color = this._color(item.value, index, total);
    const f = formatParts(item.value, c.unit, c.decimals);
    const showLabel = total > 1 && c.show_labels !== false;

    const unfilled = c.show_unfilled !== false;
    return html`
      <div class="gauge">
        <div class="gauge-container">
          <svg viewBox="0 0 100 60" class="gauge-svg">
            ${unfilled
              ? svg`<path class="arc-bg" d="M 10 50 A 40 40 0 0 1 90 50" fill="none"
                  stroke-width="${arcWidth}" stroke-linecap="round"></path>`
              : nothing}
            <path class="arc-fg" d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="${color}"
              stroke-width="${arcWidth}" stroke-linecap="round"
              stroke-dasharray="${CIRCUMFERENCE}" stroke-dashoffset="${CIRCUMFERENCE * (1 - fraction)}"></path>
          </svg>
          <div class="value-container">
            <span class="value">${f.prefix}${f.text}</span>
            ${f.suffix.trim() ? html`<span class="unit">${f.suffix.trim()}</span>` : nothing}
          </div>
        </div>
        ${showLabel ? html`<div class="series-label" title=${item.label}>${item.label}</div>` : nothing}
      </div>
    `;
  }

  render() {
    if (!this._hasQuery()) return this.renderPlaceholder();
    if (this._error) return this.renderError();
    if (!this._loaded) return this.renderLoading();

    const items = this._items.length ? this._items : [{ metric: {}, label: '', value: null }];
    const many = items.length > 1;
    const style = many ? '--gauge-min: 110px; --gauge-font: 20px' : '--gauge-min: 180px';

    return html`
      <ha-card>
        ${this.renderHeader()}
        ${this._loaded && !this._items.length
          ? html`<div class="placeholder-state">${localize('no_data', this._hass)}</div>`
          : html`<div class="gauges ${this._fixedHeight() ? 'fill' : ''}" style=${style}>
              ${items.map((item, i) => this._renderGauge(item, i, items.length))}
            </div>`}
      </ha-card>
    `;
  }

  protected _defaultColumns(): number {
    return this._items.length > 1 ? 12 : 6;
  }

  public getCardSize(): number {
    if (this._config?.card_height) return super.getCardSize();
    return this._items.length > 2 ? 5 : 3;
  }
}
