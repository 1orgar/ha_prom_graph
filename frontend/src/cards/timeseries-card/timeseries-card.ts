import { html, css, PropertyValues, unsafeCSS, nothing } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import uPlot from 'uplot';
// @ts-ignore
import uPlotCSSText from 'uplot/dist/uPlot.min.css';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { TimeseriesCardConfig } from './timeseries-card-config';
import { timeseriesStyles } from './timeseries-card-styles';
import { buildChartData, ChartData, ChartSeries, toAligned, unitBase, yRange, yTicks } from './timeseries-data';
import { formatValue } from '../../utils/format';
import { stepColor, withAlpha } from '../../utils/color';
import { rangeWindow, timeLabel } from '../../utils/time';
import { localize } from '../../localize';
import './timeseries-card-editor';

type LegendStat = 'last' | 'min' | 'max' | 'mean';

const DEFAULT_HEIGHT = 200;

@customElement('prometheus-timeseries-card')
export class TimeseriesCard extends BasePrometheusCard<TimeseriesCardConfig> {
  @state() private _data: ChartData = { times: [], series: [] };
  @state() private _cursorIdx: number | null = null;
  @state() private _hidden = new Set<string>();

  @query('.chart-container') private _chartContainer?: HTMLElement;

  private _chart?: uPlot;
  private _chartSignature = '';
  private _resizeObserver?: ResizeObserver;

  static get styles() {
    return [cardStyles, css`${unsafeCSS(uPlotCSSText)}`, timeseriesStyles];
  }

  public static getStubConfig(): Partial<TimeseriesCardConfig> {
    return {
      type: 'custom:prometheus-timeseries-card',
      title: 'Scrape duration',
      query: 'scrape_duration_seconds',
      legend_format: '{{job}}',
      time_range: '1h',
      unit: 's'
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-timeseries-card-editor');
  }

  public setConfig(config: TimeseriesCardConfig): void {
    super.setConfig(config);
    this._destroyChart();
  }

  protected _defaultColumns(): number {
    return 12;
  }

  public getCardSize(): number {
    if (this._config?.card_height) return super.getCardSize();
    return Math.ceil(((this._config?.height || DEFAULT_HEIGHT) + 100) / 50);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._destroyChart();
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this._data.times.length || !this._chartContainer) return;
    // Rebuild when the set of series changes, otherwise just update data
    const signature = this._data.series.map((s) => `${s.key}|${s.color}`).join(',');
    if (!this._chart || signature !== this._chartSignature) {
      this._destroyChart();
      this._chartSignature = signature;
      this._initChart();
    } else if (changedProps.has('_data') || changedProps.has('_hidden')) {
      this._chart.setData(this._aligned());
      this._data.series.forEach((s, i) => this._chart!.setSeries(i + 1, { show: !this._hidden.has(s.key) }));
    }
  }

  private _aligned(): uPlot.AlignedData {
    return toAligned(this._data, Boolean(this._config.stacked), this._hidden);
  }

  private _destroyChart() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    this._chart?.destroy();
    this._chart = undefined;
    this._chartSignature = '';
  }

  /** Canvas cannot use CSS variables, resolve them to real colors. */
  private _cssVar(name: string, fallback: string): string {
    return getComputedStyle(this).getPropertyValue(name).trim() || fallback;
  }

  private _fmt(v: number | null | undefined): string {
    return v === null || v === undefined ? '-' : formatValue(v, this._config.decimals, this._config.unit);
  }

  /** Chart height: the rest of a fixed-height panel, otherwise `height` (default 200). */
  private _chartHeight(): number {
    if (this._fixedHeight() && this._chartContainer) {
      return Math.max(60, Math.floor(this._chartContainer.clientHeight));
    }
    return this._config.height || DEFAULT_HEIGHT;
  }

  /** Data min / max of visible (and stacked) values. */
  private _dataExtent(aligned: uPlot.AlignedData): [number | null, number | null] {
    let min: number | null = null;
    let max: number | null = null;
    for (let i = 1; i < aligned.length; i++) {
      for (const v of aligned[i] as (number | null)[]) {
        if (v === null || v === undefined) continue;
        min = min === null ? v : Math.min(min, v);
        max = max === null ? v : Math.max(max, v);
      }
    }
    return [min, max];
  }

  /** Thresholds as dashed lines / coloured bands, drawn under the series. */
  private _drawThresholds(u: uPlot) {
    const c = this._config;
    const style = c.threshold_style || 'off';
    const thresholds = [...(c.thresholds || [])].sort((a, b) => a.value - b.value);
    if (style === 'off' || !thresholds.length) return;
    const ctx = u.ctx;
    const { left, top, width, height } = u.bbox;
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, width, height);
    ctx.clip();
    thresholds.forEach((t, i) => {
      const color = stepColor(t);
      if (!color || color === 'transparent') return;
      const y = u.valToPos(t.value, 'y', true);
      if (style === 'area') {
        const next = thresholds[i + 1];
        const y2 = next ? u.valToPos(next.value, 'y', true) : top;
        ctx.fillStyle = withAlpha(color, 0.12);
        ctx.fillRect(left, Math.min(y, y2), width, Math.abs(y - y2));
      } else if (i > 0 || thresholds.length === 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = devicePixelRatio || 1;
        ctx.setLineDash([6 * (devicePixelRatio || 1), 4 * (devicePixelRatio || 1)]);
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + width, y);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  private _initChart() {
    if (!this._chartContainer || !this._config) return;
    const c = this._config;
    const width = this._chartContainer.clientWidth || 400;
    const height = this._chartHeight();
    const textColor = this._cssVar('--secondary-text-color', '#888');
    const gridColor = this._cssVar('--divider-color', 'rgba(127,127,127,0.2)');
    const lineWidth = c.line_width ?? 2;
    const fillOn = c.fill || c.stacked;
    const opacity = Math.max(0, Math.min(100, c.fill_opacity ?? 20)) / 100;
    const showX = c.show_x_axis !== false;
    const showY = c.show_y_axis !== false;
    const grid = c.show_grid !== false ? { stroke: gridColor, width: 1 } : { show: false };
    const language = this._hass?.locale?.language;
    const base = unitBase(c.unit);

    const series: uPlot.Series[] = [{}];
    this._data.series.forEach((s) => {
      series.push({
        label: s.label,
        stroke: s.color,
        width: lineWidth,
        fill: fillOn ? withAlpha(s.color, opacity) : undefined,
        spanGaps: true,
        show: !this._hidden.has(s.key),
        points: { show: false }
      });
    });

    const axes: uPlot.Axis[] = [
      {
        show: showX,
        stroke: textColor,
        grid,
        ticks: { show: false },
        size: 24,
        space: 70,
        // always one line: HH:MM, or DD.MM for long ranges
        values: (u, vals) => {
          const span = (u.scales.x.max ?? 0) - (u.scales.x.min ?? 0);
          return vals.map((v) => (v == null ? '' : timeLabel(v, span, language)));
        }
      },
      {
        show: showY,
        stroke: textColor,
        grid,
        ticks: { show: false },
        size: (u, values) => {
          const longest = (values || []).reduce((m, v) => Math.max(m, String(v ?? '').length), 0);
          return Math.max(36, Math.min(110, longest * 7 + 14));
        },
        // ticks start at the axis origin, so its value is always labelled
        splits: (_u, _i, min, max) => yTicks(min, max, Math.max(2, Math.round(this._chartHeight() / 45)), base),
        values: (_u, vals) => vals.map((v) => (v == null ? '' : this._fmt(v)))
      }
    ];

    const opts: uPlot.Options = {
      width,
      height,
      series,
      axes,
      legend: { show: false },
      padding: [8, 8, showX ? 0 : 8, showY ? 0 : 8],
      scales: {
        x: { time: true },
        y: {
          range: (u) => {
            const [dmin, dmax] = this._dataExtent(u.data);
            const ticks = Math.max(2, Math.round(this._chartHeight() / 45));
            return yRange(dmin, dmax, { min: c.min, max: c.max, stacked: c.stacked, ticks, base });
          }
        }
      },
      cursor: { points: { size: 6 } },
      hooks: {
        setCursor: [(u) => (this._cursorIdx = u.cursor.idx ?? null)],
        drawClear: [(u) => this._drawThresholds(u)]
      }
    };

    this._chart = new uPlot(opts, this._aligned(), this._chartContainer);
    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this._chartContainer && this._chart && entry.contentRect.width > 0) {
          const size = { width: Math.floor(entry.contentRect.width), height: this._chartHeight() };
          if (size.width !== this._chart.width || size.height !== this._chart.height) this._chart.setSize(size);
        }
      }
    });
    this._resizeObserver.observe(this._chartContainer);
  }


  protected async _fetchData(): Promise<void> {
    const c = this._config;
    try {
      this._loading = true;
      const win = rangeWindow(c.time_range || '1h');
      const step = c.step ? String(c.step) : win.step;
      const res = await this._client.rangeQuery(c.query!, win.start, win.end, step);
      this._data = buildChartData(res, c.legend_format, c.palette);
      this._error = undefined;
    } catch (e: any) {
      this._error = this._formatError(e);
    } finally {
      this._loading = false;
    }
  }

  private _toggle(key: string, ev: MouseEvent) {
    const next = new Set(this._hidden);
    const all = this._data.series.map((s) => s.key);
    if (ev.ctrlKey || ev.metaKey || ev.shiftKey) {
      if (next.has(key)) next.delete(key);
      else next.add(key);
    } else {
      // Grafana behaviour: click isolates a series, click again shows all
      const isolated = next.size === all.length - 1 && !next.has(key);
      next.clear();
      if (!isolated) all.filter((k) => k !== key).forEach((k) => next.add(k));
    }
    this._hidden = next;
  }

  private _current(s: ChartSeries): number | null {
    return this._cursorIdx !== null ? s.values[this._cursorIdx] ?? null : s.stats.last;
  }

  /** Current (hovered or last) value in the legend, `show_current` (default off). */
  private _showCurrent(): boolean {
    return this._config.show_current === true;
  }

  protected render() {
    if (!this._hasQuery()) return this.renderPlaceholder();
    const c = this._config;
    const hasData = this._data.times.length > 0;
    const fixed = this._fixedHeight();

    let overlay: unknown = nothing;
    if (this._error) {
      overlay = html`<div class="error-state">${this._error}</div>`;
    } else if (!hasData) {
      overlay = this._loading
        ? html`<div class="loading-state"></div>`
        : html`<div class="placeholder-state">${localize('no_data', this._hass)}</div>`;
    }
    const chartStyle = fixed ? '' : `height: ${hasData ? c.height || DEFAULT_HEIGHT : 0}px`;

    return html`
      <ha-card>
        ${this.renderHeader()}
        <div class="chart-container ${fixed ? 'fill' : ''}" style=${chartStyle}></div>
        ${overlay}
        ${c.show_legend !== false && hasData ? this._renderLegend() : nothing}
      </ha-card>
    `;
  }

  private _renderLegendTable(stats: LegendStat[]) {
    const showCurrent = this._showCurrent();
    return html`
      <div class="legend-table-wrap">
        <table class="legend-table">
          <thead>
            <tr>
              <th></th>
              ${stats.map((st) => html`<th>${localize(`legend_value_${st}`, this._hass)}</th>`)}
              ${showCurrent ? html`<th>${localize('current', this._hass)}</th>` : nothing}
            </tr>
          </thead>
          <tbody>
            ${this._data.series.map(
              (s) => html`
                <tr class=${this._hidden.has(s.key) ? 'hidden' : ''} @click=${(e: MouseEvent) => this._toggle(s.key, e)}>
                  <td>
                    <div class="name-cell" title=${s.label}>
                      <span class="legend-color" style="background:${s.color}"></span><span>${s.label}</span>
                    </div>
                  </td>
                  ${stats.map((st) => html`<td>${this._fmt(s.stats[st])}</td>`)}
                  ${showCurrent ? html`<td>${this._fmt(this._current(s))}</td>` : nothing}
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  private _renderLegend() {
    // statistics columns exist only in the table legend
    if (this._config.legend_mode === 'table') {
      return this._renderLegendTable((this._config.legend_values || []) as LegendStat[]);
    }
    return html`
      <div class="legend">
        ${this._data.series.map(
          (s) => html`
            <div
              class="legend-item ${this._hidden.has(s.key) ? 'hidden' : ''}"
              title=${s.label}
              @click=${(e: MouseEvent) => this._toggle(s.key, e)}
            >
              <div class="legend-color" style="background-color: ${s.color}"></div>
              <span class="legend-name">${s.label}</span>
              ${this._showCurrent() ? html`<span class="legend-value">${this._fmt(this._current(s))}</span>` : nothing}
            </div>
          `
        )}
      </div>
    `;
  }
}

