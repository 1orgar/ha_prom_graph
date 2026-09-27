import { html, css, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import uPlot from 'uplot';
// @ts-ignore
import uPlotCSSText from 'uplot/dist/uPlot.min.css';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { TimeseriesCardConfig } from './timeseries-card-config';
import { formatValue } from '../../utils/format';
import { DEFAULT_SERIES_COLORS } from '../../utils/color';
import { parseTimeRange, calculateStep } from '../../utils/time';

@customElement('prometheus-timeseries-card')
export class TimeseriesCard extends BasePrometheusCard {
  @property({ attribute: false }) public _config!: TimeseriesCardConfig;
  
  @state() private _chartData: uPlot.AlignedData = [[]];
  @state() private _currentValues: Record<number, number | null> = {};
  
  @query('.chart-container') private _chartContainer!: HTMLElement;
  
  private _chart?: uPlot;
  private _resizeObserver?: ResizeObserver;
  
  static get styles() {
    return [
      cardStyles,
      css`${unsafeCSS(uPlotCSSText)}`,
      css`
        :host {
          display: block;
        }
        .header {
          padding: 16px 16px 0;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .chart-container {
          width: 100%;
          position: relative;
          padding-top: 16px;
        }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding: 8px 16px 16px;
          font-size: 12px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        .legend-name {
          color: var(--primary-text-color);
        }
        .legend-value {
          font-weight: 500;
          color: var(--primary-text-color);
        }
        /* Custom uPlot styling for HA themes */
        .uplot {
          font-family: inherit;
        }
        .uplot .u-legend {
          display: none; /* We use our own legend */
        }
        .uplot .u-axis {
          font-size: 10px;
        }
      `
    ];
  }

  public setConfig(config: TimeseriesCardConfig): void {
    super.setConfig(config);
    if (!config.series || !Array.isArray(config.series) || config.series.length === 0) {
      throw new Error('Please define at least one series');
    }
    // If config changed structurally, we should rebuild chart
    if (this._chart) {
      this._destroyChart();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._destroyChart();
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('_config') && this._chartContainer && !this._chart) {
      this._initChart();
    }
  }

  private _destroyChart() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
    if (this._chart) {
      this._chart.destroy();
      this._chart = undefined;
    }
  }

  private _initChart() {
    if (!this._chartContainer || !this._config) return;

    const width = this._chartContainer.clientWidth || 400;
    const height = this._config.height || 200;

    const series: uPlot.Series[] = [
      {} // X axis (time)
    ];

    this._config.series.forEach((s, i) => {
      const color = s.color || DEFAULT_SERIES_COLORS[i % DEFAULT_SERIES_COLORS.length];
      series.push({
        label: s.name || `Series ${i + 1}`,
        stroke: color,
        width: 2,
        fill: this._config.fill ? `${color}33` : undefined, // 33 for 20% opacity hex
      });
    });

    const axes: uPlot.Axis[] = [
      {
        stroke: 'var(--secondary-text-color)',
        grid: { stroke: 'var(--divider-color)', width: 1 },
        ticks: { stroke: 'var(--divider-color)', width: 1 }
      },
      {
        stroke: 'var(--secondary-text-color)',
        grid: { stroke: 'var(--divider-color)', width: 1 },
        ticks: { stroke: 'var(--divider-color)', width: 1 },
        values: (u, vals) => vals.map(v => formatValue(v, this._config.decimals, this._config.unit))
      }
    ];

    const opts: uPlot.Options = {
      width,
      height,
      series,
      axes,
      cursor: {
        points: { size: 6, fill: 'var(--card-background-color)' },
      },
      hooks: {
        setCursor: [
          (u) => {
            if (u.cursor.idx != null) {
              const idx = u.cursor.idx;
              const values: Record<number, number | null> = {};
              for (let i = 1; i < u.series.length; i++) {
                values[i - 1] = u.data[i][idx] !== undefined ? u.data[i][idx] : null;
              }
              this._currentValues = values;
            }
          }
        ]
      }
    };

    this._chart = new uPlot(opts, this._chartData, this._chartContainer);

    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this._chartContainer && this._chart) {
          this._chart.setSize({
            width: entry.contentRect.width,
            height: this._config.height || 200
          });
        }
      }
    });
    this._resizeObserver.observe(this._chartContainer);
  }

  protected async _fetchData(): Promise<void> {
    if (!this._client || !this._config.series) return;

    try {
      const timeRange = this._config.time_range || '1h';
      const { start: startTs, end: endTs } = parseTimeRange(timeRange);
      const start = startTs;
      const end = endTs;
      const stepParam = this._config.step || calculateStep(start, end);

      // Fetch all series concurrently
      const promises = this._config.series.map(s => 
        this._client!.rangeQuery(s.query, start, end, stepParam)
      );
      const results = await Promise.all(promises);

      // Align data
      // For simplicity, we assume step is respected by prometheus and we collect all unique timestamps
      const timeMap = new Map<number, (number | null)[]>();
      
      results.forEach((res, sIdx) => {
        if (res.data.result && res.data.result.length > 0) {
          // just taking the first metric matching the query for this series
          const values = res.data.result[0].values || [];
          values.forEach(v => {
            const t = v[0];
            const val = parseFloat(v[1]);
            if (!timeMap.has(t)) {
              timeMap.set(t, new Array(this._config.series.length).fill(null));
            }
            timeMap.get(t)![sIdx] = val;
          });
        }
      });

      const times = Array.from(timeMap.keys()).sort((a, b) => a - b);
      const alignedData: uPlot.AlignedData = [times];
      
      for (let i = 0; i < this._config.series.length; i++) {
        const seriesData = times.map(t => timeMap.get(t)![i]);
        alignedData.push(seriesData);
      }

      this._chartData = alignedData;
      
      // Update latest values for legend
      if (times.length > 0) {
        const latestValues: Record<number, number | null> = {};
        for (let i = 0; i < this._config.series.length; i++) {
          latestValues[i] = alignedData[i + 1][times.length - 1];
        }
        this._currentValues = latestValues;
      }

      if (this._chart) {
        this._chart.setData(this._chartData);
      }

    } catch (e: any) {
      this._error = e.message || 'Error fetching time series data';
    }
  }

  protected render() {
    if (!this._config) {
      return html``;
    }

    return html`
      <ha-card>
        ${this._config.title ? html`<div class="header">${this._config.title}</div>` : ''}
        ${this.renderError()}
        <div class="chart-container"></div>
        ${this.renderLoading()}
        ${this._config.show_legend !== false ? this._renderLegend() : ''}
      </ha-card>
    `;
  }

  private _renderLegend() {
    if (!this._config.series) return html``;
    return html`
      <div class="legend">
        ${this._config.series.map((s, i) => {
          const color = s.color || DEFAULT_SERIES_COLORS[i % DEFAULT_SERIES_COLORS.length];
          const val = this._currentValues[i];
          const formatted = val !== null && val !== undefined ? formatValue(val, this._config.decimals, this._config.unit) : '-';
          return html`
            <div class="legend-item">
              <div class="legend-color" style="background-color: ${color}"></div>
              <span class="legend-name">${s.name || `Series ${i + 1}`}</span>
              <span class="legend-value">${formatted}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  public static getStubConfig(): Partial<TimeseriesCardConfig> {
    return {
      type: 'custom:prometheus-timeseries-card',
      title: 'Prometheus Timeseries',
      time_range: '1h',
      series: [
        { query: '', name: 'Series 1' }
      ]
    };
  }
}
