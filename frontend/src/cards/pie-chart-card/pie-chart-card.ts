import { html, nothing, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { PieChartCardConfig } from './pie-chart-card-config';
import { pieStyles } from './pie-chart-card-styles';
import { arcPath, buildSlices, labelPoint, Slice } from './pie-data';
import { formatValue } from '../../utils/format';
import { localize } from '../../localize';
import './pie-chart-card-editor';

@customElement('prometheus-pie-card')
export class PieChartCard extends BasePrometheusCard<PieChartCardConfig> {
  @state() private _slices: Slice[] = [];
  @state() private _loaded = false;
  @state() private _active: number | null = null;

  static get styles() {
    return [cardStyles, pieStyles];
  }

  static getStubConfig(): Partial<PieChartCardConfig> {
    return {
      type: 'custom:prometheus-pie-card',
      title: 'Series by job',
      query: 'count by (job) (up)',
      legend_format: '{{job}}',
      pie_type: 'donut'
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-pie-card-editor');
  }

  public getCardSize(): number {
    if (this._config?.card_height) return super.getCardSize();
    return 4;
  }

  protected async _fetchData(): Promise<void> {
    const c = this._config;
    try {
      this._loading = true;
      const res = await this._client.instantQuery(c.query!);
      this._slices = buildSlices(res, c.legend_format, {
        palette: c.palette,
        sort: c.sort,
        limit: c.limit,
        otherLabel: localize('other', this._hass)
      });
      this._error = undefined;
    } catch (e: any) {
      this._error = this._formatError(e);
    } finally {
      this._loading = false;
      this._loaded = true;
    }
  }

  private _fmt(v: number): string {
    return formatValue(v, this._config.decimals, this._config.unit);
  }

  private _renderChart() {
    const c = this._config;
    const donut = c.pie_type !== 'pie';
    const outer = 48;
    const inner = donut ? outer * (1 - Math.max(10, Math.min(90, c.donut_width ?? 40)) / 100) : 0;
    const total = this._slices.reduce((a, s) => a + s.value, 0);
    let angle = 0;
    const active = this._active !== null ? this._slices[this._active] : undefined;

    const paths = this._slices.map((s, i) => {
      const start = angle;
      const end = angle + (s.percent / 100) * 360;
      angle = end;
      const cls = `slice ${this._active === i ? 'active' : ''} ${this._active !== null && this._active !== i ? 'dim' : ''}`;
      const [lx, ly] = labelPoint(start, end, donut ? (outer + inner) / 2 : outer * 0.62);
      return svg`
        <path class=${cls} d=${arcPath(start, end, outer, inner)} fill=${s.color}
          @mouseenter=${() => (this._active = i)} @mouseleave=${() => (this._active = null)}>
          <title>${s.label}: ${this._fmt(s.value)} (${s.percent.toFixed(1)}%)</title>
        </path>
        ${c.show_labels && s.percent >= 5
          ? svg`<text class="slice-label" x=${lx} y=${ly} text-anchor="middle" dominant-baseline="middle">${Math.round(s.percent)}%</text>`
          : nothing}
      `;
    });

    return html`
      <div class="chart">
        <svg viewBox="0 0 100 100">${paths}</svg>
        ${donut && c.show_total !== false
          ? html`<div class="center">
              <div class="total">${this._fmt(active ? active.value : total)}</div>
              <div class="caption">${active ? active.label : localize('total', this._hass)}</div>
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderLegend() {
    const values = this._config.legend_values || ['value'];
    return html`<div class="legend">
      ${this._slices.map(
        (s, i) => html`<div
          class="legend-item ${this._active !== null && this._active !== i ? 'dim' : ''}"
          title=${s.label}
          @mouseenter=${() => (this._active = i)}
          @mouseleave=${() => (this._active = null)}
        >
          <span class="legend-color" style="background:${s.color}"></span>
          <span class="legend-name">${s.label}</span>
          <span class="legend-value">
            ${values.includes('value') ? this._fmt(s.value) : nothing}
            ${values.includes('percent') ? html`${values.includes('value') ? ' · ' : ''}${s.percent.toFixed(1)}%` : nothing}
          </span>
        </div>`
      )}
    </div>`;
  }

  protected render() {
    const c = this._config;
    if (!this._hasQuery()) return this.renderPlaceholder();
    if (this._error) return this.renderError();
    if (!this._loaded) return this.renderLoading();

    return html`
      <ha-card>
        ${this.renderHeader()}
        ${this._slices.length
          ? html`<div
              class="body ${c.legend_position === 'bottom' ? 'bottom' : ''} ${this._fixedHeight() ? 'fill' : ''}"
              style="--pie-size: ${c.size || 180}px"
            >
              ${this._renderChart()} ${c.show_legend !== false ? this._renderLegend() : nothing}
            </div>`
          : html`<div class="placeholder-state">${localize('no_data', this._hass)}</div>`}
      </ha-card>
    `;
  }
}
