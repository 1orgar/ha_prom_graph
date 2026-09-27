import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { BarChartCardConfig } from './bar-chart-card-config';
import { formatValue } from '../../utils/format';
import { getThresholdColor } from '../../utils/color';

interface BarData {
  label: string;
  value: number;
  color: string;
}

@customElement('prometheus-bar-card')
export class BarChartCard extends BasePrometheusCard {
  @property({ attribute: false }) public _config!: BarChartCardConfig;
  
  @state() private _barData: BarData[] = [];
  @state() private _calculatedMax: number = 0;

  static get styles() {
    return [
      cardStyles,
      css`
        :host {
          display: block;
        }
        .header {
          padding: 16px 16px 8px;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .bars-container-horizontal {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 8px 16px 16px;
        }
        .bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bar-label {
          width: 80px;
          flex-shrink: 0;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
        }
        .bar-track {
          flex-grow: 1;
          background: var(--secondary-background-color, rgba(100, 100, 100, 0.2));
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease-out;
        }
        .bar-value {
          width: 60px;
          flex-shrink: 0;
          text-align: right;
          font-size: 14px;
          font-weight: 500;
        }

        .bars-container-vertical {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 16px;
          height: 200px;
          justify-content: space-around;
        }
        .bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
          height: 100%;
        }
        .bar-col-value {
          font-size: 12px;
          font-weight: 500;
        }
        .bar-col-track {
          width: 100%;
          max-width: 40px;
          flex-grow: 1;
          background: var(--secondary-background-color, rgba(100, 100, 100, 0.2));
          border-radius: 4px;
          position: relative;
          display: flex;
          align-items: flex-end;
        }
        .bar-col-fill {
          width: 100%;
          border-radius: 4px;
          transition: height 0.3s ease-out;
        }
        .bar-col-label {
          font-size: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 100%;
        }
      `
    ];
  }

  public setConfig(config: BarChartCardConfig): void {
    super.setConfig(config);
    if (!config.query) {
      throw new Error('Please define a query');
    }
  }

  protected async _fetchData(): Promise<void> {
    if (!this._client || !this._config.query) return;

    try {
      const response = await this._client.instantQuery(this._config.query!);
      
      if (!response.data || !response.data.result) {
        this._barData = [];
        return;
      }

      const results = response.data.result;
      const data: BarData[] = [];
      let maxVal = 0;

      for (const res of results) {
        let label = 'Value';
        if (this._config.group_by && res.metric[this._config.group_by]) {
          label = res.metric[this._config.group_by];
        } else if (Object.keys(res.metric).length > 0) {
          // fallback to first label if group_by not found
          const firstKey = Object.keys(res.metric)[0];
          label = res.metric[firstKey];
        }

        const value = res.value ? parseFloat(res.value[1]) : 0;
        if (value > maxVal) maxVal = value;

        data.push({
          label,
          value,
          color: 'var(--primary-color)'
        });
      }

      // Sort descending
      data.sort((a, b) => b.value - a.value);

      this._calculatedMax = this._config.max || maxVal || 100;

      // Assign colors based on thresholds
      data.forEach(d => {
        d.color = getThresholdColor(d.value, this._config.thresholds || []);
      });

      this._barData = data;

    } catch (e: any) {
      this._error = e.message || 'Error fetching bar chart data';
    }
  }

  protected render() {
    if (!this._config) return html``;

    return html`
      <ha-card>
        ${this._config.name ? html`<div class="header">${this._config.name}</div>` : ''}
        ${this.renderError()}
        ${this._barData.length > 0 ? this._renderBars() : html`<div style="padding: 16px;">No data</div>`}
        ${this.renderLoading()}
      </ha-card>
    `;
  }

  private _renderBars() {
    const isVertical = this._config.orientation === 'vertical';

    if (isVertical) {
      return html`
        <div class="bars-container-vertical">
          ${this._barData.map(d => {
            const pct = Math.min(100, Math.max(0, (d.value / this._calculatedMax) * 100));
            return html`
              <div class="bar-col">
                ${this._config.show_values !== false ? html`<div class="bar-col-value">${formatValue(d.value, this._config.decimals, this._config.unit)}</div>` : ''}
                <div class="bar-col-track">
                  <div class="bar-col-fill" style="height: ${pct}%; background-color: ${d.color};"></div>
                </div>
                <div class="bar-col-label" title="${d.label}">${d.label}</div>
              </div>
            `;
          })}
        </div>
      `;
    }

    // Horizontal (Default)
    const barHeight = this._config.bar_height || 24;
    return html`
      <div class="bars-container-horizontal">
        ${this._barData.map(d => {
          const pct = Math.min(100, Math.max(0, (d.value / this._calculatedMax) * 100));
          return html`
            <div class="bar-row">
              <div class="bar-label" title="${d.label}">${d.label}</div>
              <div class="bar-track" style="height: ${barHeight}px;">
                <div class="bar-fill" style="width: ${pct}%; background-color: ${d.color};"></div>
              </div>
              ${this._config.show_values !== false ? html`<div class="bar-value">${formatValue(d.value, this._config.decimals, this._config.unit)}</div>` : ''}
            </div>
          `;
        })}
      </div>
    `;
  }

  public static getStubConfig(): Partial<BarChartCardConfig> {
    return {
      type: 'custom:prometheus-bar-card',
      name: 'Prometheus Bar Chart',
      query: '',
      orientation: 'horizontal'
    };
  }
}
