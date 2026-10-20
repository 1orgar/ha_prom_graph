import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { BarGaugeCardConfig } from './bar-gauge-card-config';
import { barBackground } from './bar-gauge-data';
import { formatParts, shortLabel } from '../../utils/format';
import { InstantSeries, itemColor, parseInstant } from '../../utils/series';
import { localize } from '../../localize';
import './bar-gauge-card-editor';

@customElement('prometheus-bar-gauge-card')
export class BarGaugeCard extends BasePrometheusCard<BarGaugeCardConfig> {
  @state() private _items: InstantSeries[] = [];
  @state() private _loaded = false;

  static get styles() {
    return [
      cardStyles,
      css`
        .list { display: flex; flex-direction: column; gap: 10px; }
        .list.fill.auto .row { flex: 1 1 0; min-height: 0; }
        .list.fill.auto .track { flex: 1 1 auto; height: auto; min-height: 4px; max-height: 64px; }
        .cols.fill { height: auto; }
        .row { display: flex; flex-direction: column; gap: 3px; }
        .row-head { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; }
        .label { color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .value { font-weight: 600; white-space: nowrap; }
        .track { position: relative; border-radius: 3px; overflow: hidden; height: var(--bar-h, 18px); }
        .track.unfilled { background: var(--secondary-background-color, rgba(127, 127, 127, 0.15)); }
        .fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
        .cols { display: flex; gap: 10px; align-items: flex-end; height: 180px; }
        .col { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
        .col .track { width: 100%; max-width: 48px; height: auto; flex: 1; display: flex; align-items: flex-end; }
        .col .fill { width: 100%; transition: height 0.4s ease; }
        .col .label { font-size: 11px; max-width: 100%; }
        .col .value { font-size: 12px; }
      `
    ];
  }

  static getStubConfig(): Partial<BarGaugeCardConfig> {
    return {
      type: 'custom:prometheus-bar-gauge-card',
      title: 'Disk usage',
      query: '100 - node_filesystem_avail_bytes / node_filesystem_size_bytes * 100',
      legend_format: '{{mountpoint}}',
      unit: 'percent',
      min: 0,
      max: 100,
      thresholds: [
        { value: 0, color: '#73BF69' },
        { value: 70, color: '#FF9830' },
        { value: 90, color: '#F2495C' }
      ]
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-bar-gauge-card-editor');
  }


  protected async _fetchData(): Promise<void> {
    const c = this._config;
    try {
      this._loading = true;
      const res = await this._client.instantQuery(c.query!);
      let items = parseInstant(res, c.legend_format)
        .filter((s) => s.value !== null)
        .map((s) => ({ ...s, label: shortLabel(s.metric, c.legend_format) }));
      const sort = c.sort || 'none';
      if (sort === 'desc') items.sort((a, b) => b.value! - a.value!);
      else if (sort === 'asc') items.sort((a, b) => a.value! - b.value!);
      else if (sort === 'name') items.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
      if (c.limit && c.limit > 0) items = items.slice(0, c.limit);
      this._items = items;
      this._error = undefined;
    } catch (e: any) {
      this._error = this._formatError(e);
    } finally {
      this._loading = false;
      this._loaded = true;
    }
  }

  private _bar(item: InstantSeries, i: number, max: number, vertical: boolean) {
    const c = this._config;
    const min = c.min ?? 0;
    const v = item.value ?? min;
    const pct = max > min ? Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100)) : 0;
    const palette = itemColor(i, this._items.length, c.palette);
    const thresholds = c.color_mode === 'series' ? [] : c.thresholds || [];
    const bg = barBackground(c.display_mode || 'gradient', v, min, max, thresholds, palette);
    const f = formatParts(item.value, c.unit, c.decimals);
    const track = c.show_unfilled !== false ? 'track unfilled' : 'track';
    const size = vertical ? `height:${pct}%` : `width:${pct}%`;
    return html`
      <div class=${vertical ? 'col' : 'row'}>
        ${vertical
          ? html`<span class="value" style="color:${bg.color}">${f.prefix}${f.text}${f.suffix}</span>`
          : html`<div class="row-head">
              <span class="label" title=${item.label}>${item.label}</span>
              <span class="value" style="color:${bg.color}">${f.prefix}${f.text}${f.suffix}</span>
            </div>`}
        <div class=${track}><div class="fill" style="${size};background:${bg.fill}"></div></div>
        ${vertical ? html`<span class="label" title=${item.label}>${item.label}</span>` : nothing}
      </div>
    `;
  }

  render() {
    const c = this._config;
    if (!this._hasQuery()) return this.renderPlaceholder();
    if (this._error) return this.renderError();
    if (!this._loaded) return this.renderLoading();
    const max = c.max ?? Math.max(100, ...this._items.map((i) => i.value ?? 0));
    const vertical = c.orientation === 'vertical';
    return html`
      <ha-card>
        ${this.renderHeader()}
        ${this._items.length
          ? html`<div
              class="${vertical ? 'cols' : 'list'} ${this._fixedHeight() ? 'fill' : ''} ${c.bar_height ? '' : 'auto'}"
              style=${c.bar_height ? `--bar-h:${c.bar_height}px` : ''}
            >
              ${this._items.map((it, i) => this._bar(it, i, max, vertical))}
            </div>`
          : html`<div class="placeholder-state">${localize('no_data', this._hass)}</div>`}
      </ha-card>
    `;
  }
}
