import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { BarChartCardConfig } from './bar-chart-card-config';
import { barChartStyles } from './bar-chart-card-styles';
import { BarData, barPercent, buildBars, gradientFill } from './bar-data';
import { formatValue } from '../../utils/format';
import { localize } from '../../localize';
import './bar-chart-card-editor';

@customElement('prometheus-bar-card')
export class BarChartCard extends BasePrometheusCard<BarChartCardConfig> {
  @state() private _barData: BarData[] = [];
  @state() private _calculatedMax: number = 0;
  @state() private _loaded = false;

  static get styles() {
    return [cardStyles, barChartStyles];
  }

  public static getStubConfig(): Partial<BarChartCardConfig> {
    return {
      type: 'custom:prometheus-bar-card',
      title: 'Scrape duration',
      query: 'scrape_duration_seconds',
      legend_format: '{{job}}',
      unit: 's',
      orientation: 'horizontal'
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-bar-card-editor');
  }

  protected async _fetchData(): Promise<void> {
    try {
      this._loading = true;
      const res = await this._client.instantQuery(this._config.query!);
      const { bars, max } = buildBars(res, this._config);
      this._barData = bars;
      this._calculatedMax = max;
      this._error = undefined;
    } catch (e: any) {
      this._error = this._formatError(e);
    } finally {
      this._loading = false;
      this._loaded = true;
    }
  }

  protected render() {
    if (!this._hasQuery()) return this.renderPlaceholder();

    let body;
    if (this._error) {
      body = html`<div class="error-state">${this._error}</div>`;
    } else if (this._barData.length > 0) {
      body = this._renderBars();
    } else if (!this._loaded) {
      body = html`<div class="loading-state"></div>`;
    } else {
      body = html`<div class="placeholder-state">${localize('no_data', this._hass)}</div>`;
    }

    return html`
      <ha-card>
        ${this.renderHeader()}
        <div class="body ${this._fixedHeight() ? 'fill' : ''}">${body}</div>
      </ha-card>
    `;
  }

  private _fmt(value: number): string {
    return formatValue(value, this._config.decimals, this._config.unit);
  }

  /** Background of a bar: the value colour, or the threshold gradient (`gradient`). */
  private _fill(d: BarData, pct: number, vertical: boolean): string {
    const c = this._config;
    const byThresholds = c.color_mode !== 'series';
    const gradient = c.gradient && byThresholds ? gradientFill(c.thresholds, this._calculatedMax || 1, pct, vertical) : null;
    return `background: ${gradient ?? d.color};`;
  }

  private _renderBars() {
    const c = this._config;
    const max = this._calculatedMax || 1;
    const showValues = c.show_values !== false;
    const clear = Boolean(c.transparent_track);
    // value right after the bar end: only when the unfilled part is transparent
    const atEnd = showValues && clear && Boolean(c.value_at_end);
    const trackCls = `track ${clear ? 'clear' : ''}`;

    if (c.orientation === 'vertical') {
      return html`
        <div class="bars-vertical">
          ${this._barData.map((d) => {
            const pct = barPercent(d.value, max);
            return html`
              <div class="bar-col">
                ${showValues && !atEnd ? html`<div class="bar-col-value">${this._fmt(d.value)}</div>` : nothing}
                <div class="${trackCls} col-track">
                  ${atEnd ? html`<div class="end-value" style="bottom: ${pct}%">${this._fmt(d.value)}</div>` : nothing}
                  <div class="bar-fill" style="height: ${pct}%; ${this._fill(d, pct, true)}"></div>
                </div>
                <div class="bar-col-label" title="${d.label}">${d.label}</div>
              </div>
            `;
          })}
        </div>
      `;
    }

    // horizontal: explicit bar height, otherwise auto (rows share the panel height)
    const style = c.bar_height ? `--bar-h: ${c.bar_height}px` : '';
    return html`
      <div class="bars-horizontal ${c.bar_height ? '' : 'auto'}" style=${style}>
        ${this._barData.map((d) => {
          const pct = barPercent(d.value, max);
          return html`
            <div class="bar-row">
              <div class="bar-label" title="${d.label}">${d.label}</div>
              <div class="${trackCls} row-track ${atEnd ? 'with-end' : ''}">
                <!-- with the value at the end the bar scales to the space left for the value -->
                <div class="bar-fill" style="width: ${atEnd ? `calc((100% - var(--end-w)) * ${pct / 100})` : `${pct}%`}; ${this._fill(d, pct, false)}"></div>
                ${atEnd ? html`<div class="end-value">${this._fmt(d.value)}</div>` : nothing}
              </div>
              ${showValues && !atEnd ? html`<div class="bar-value">${this._fmt(d.value)}</div>` : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }
}
