import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { formatValue } from '../../utils/format';
import { getThresholdColor } from '../../utils/color';
import { calculateStep } from '../../utils/time';
import '../../shared/sparkline';
import { StatCardConfig } from './stat-card-config';

@customElement('prometheus-stat-card')
export class StatCard extends BasePrometheusCard {
  @state() private _currentValue: number | null = null;
  @state() private _sparklineData: number[] = [];

  static getStubConfig(): Partial<StatCardConfig> {
    return {
      type: 'custom:prometheus-stat-card',
      name: 'Prometheus Stat',
      query: '',
      entry_id: '',
      decimals: 1,
      sparkline: false
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-stat-card-editor');
  }

  setConfig(config: StatCardConfig) {
    super.setConfig(config);
  }

  protected async _fetchData() {
    if (!this._config || !this._config.query) {
      return;
    }
    const config = this._config as StatCardConfig;
    
    try {
      this._loading = true;
      
      if (config.sparkline) {
        const hours = config.sparkline_hours || 24;
        const end = Math.floor(Date.now() / 1000);
        const start = end - hours * 3600;
        const step = calculateStep(start, end, 100);
        
        const result = await this._client.rangeQuery(config.query!, start, end, step);
        if (result?.data?.result?.length > 0 && result.data.result[0].values) {
          const values = result.data.result[0].values.map(v => parseFloat(v[1]));
          this._sparklineData = values;
          this._currentValue = values.length > 0 ? values[values.length - 1] : null;
        } else {
          this._sparklineData = [];
          this._currentValue = null;
        }
      } else {
        const result = await this._client.instantQuery(config.query!);
        if (result?.data?.result?.length > 0 && result.data.result[0].value) {
          this._currentValue = parseFloat(result.data.result[0].value[1]);
        } else {
          this._currentValue = null;
        }
        this._sparklineData = [];
      }
      
      this._data = this._currentValue;
      this._error = undefined;
    } catch (e: any) {
      this._error = e.message || 'Error fetching data';
    } finally {
      this._loading = false;
    }
  }

  render() {
    if (!this._config) {
      return html``;
    }
    const config = this._config as StatCardConfig;
    
    if (this._error) {
      return this.renderError();
    }
    if (this._loading && this._currentValue === null) {
      return this.renderLoading();
    }
    
    const color = getThresholdColor(this._currentValue, config.thresholds || []);
    const decimals = config.decimals !== undefined ? config.decimals : 1;
    const displayValue = this._currentValue !== null ? formatValue(this._currentValue, decimals) : '-';
    
    return html`
      <ha-card>
        <div class="stat-container">
          ${config.icon ? html`
            <div class="icon-container" style="--icon-color: ${color}">
              <ha-icon .icon="${config.icon}"></ha-icon>
            </div>
          ` : ''}
          <div class="info-container">
            ${config.name ? html`<div class="name">${config.name}</div>` : ''}
            <div class="value-container">
              <span class="value">${displayValue}</span>
              ${config.unit ? html`<span class="unit">${config.unit}</span>` : ''}
            </div>
          </div>
        </div>
        ${config.sparkline && this._sparklineData.length > 0 ? html`
          <div class="sparkline-container">
            <prometheus-sparkline 
              .data="${this._sparklineData}" 
              .color="${color}"
            ></prometheus-sparkline>
          </div>
        ` : ''}
      </ha-card>
    `;
  }

  static get styles() {
    return [
      cardStyles,
      css`
        ha-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .stat-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: color-mix(in srgb, var(--icon-color, var(--primary-color)) 20%, transparent);
          color: var(--icon-color, var(--primary-color));
        }
        .info-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .name {
          font-size: 14px;
          color: var(--secondary-text-color);
          font-weight: 500;
        }
        .value-container {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .value {
          font-size: 36px;
          font-weight: 400;
          color: var(--primary-text-color);
        }
        .unit {
          font-size: 16px;
          color: var(--secondary-text-color);
        }
        .sparkline-container {
          height: 40px;
          width: 100%;
        }
      `
    ];
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'prometheus-stat-card',
  name: 'Prometheus Stat',
  description: 'Display a Prometheus metric as a stat value',
  preview: true
});
