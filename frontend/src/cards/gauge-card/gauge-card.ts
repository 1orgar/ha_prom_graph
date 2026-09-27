import { html, css, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { formatValue } from '../../utils/format';
import { getThresholdColor } from '../../utils/color';
import { GaugeCardConfig } from './gauge-card-config';

@customElement('prometheus-gauge-card')
export class GaugeCard extends BasePrometheusCard {
  @state() private _currentValue: number | null = null;

  static getStubConfig(): Partial<GaugeCardConfig> {
    return {
      type: 'custom:prometheus-gauge-card',
      name: 'Prometheus Gauge',
      query: '',
      entry_id: '',
      min: 0,
      max: 100,
      decimals: 1,
      arc_width: 8
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-gauge-card-editor');
  }

  setConfig(config: GaugeCardConfig) {
    super.setConfig(config);
  }

  protected async _fetchData() {
    if (!this._config || !this._config.query) {
      return;
    }
    
    try {
      this._loading = true;
      const result = await this._client.instantQuery(this._config.query!);
      if (result?.data?.result?.length > 0 && result.data.result[0].value) {
        this._currentValue = parseFloat(result.data.result[0].value[1]);
      } else {
        this._currentValue = null;
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
    const config = this._config as GaugeCardConfig;
    
    if (this._error) {
      return this.renderError();
    }
    if (this._loading && this._currentValue === null) {
      return this.renderLoading();
    }
    
    const min = config.min !== undefined ? config.min : 0;
    const max = config.max !== undefined ? config.max : 100;
    const decimals = config.decimals !== undefined ? config.decimals : 1;
    const arcWidth = config.arc_width !== undefined ? config.arc_width : 8;
    
    const val = this._currentValue !== null ? this._currentValue : min;
    const clampedVal = Math.min(Math.max(val, min), max);
    
    // Semi-circle math
    const radius = 40;
    const circumference = Math.PI * radius;
    const fraction = (clampedVal - min) / (max - min);
    const dashoffset = circumference * (1 - fraction);
    
    const color = getThresholdColor(this._currentValue, config.thresholds || []);
    const displayValue = this._currentValue !== null ? formatValue(this._currentValue, decimals) : '-';
    
    return html`
      <ha-card>
        ${config.name ? html`<div class="name">${config.name}</div>` : ''}
        
        <div class="gauge-container">
          <svg viewBox="0 0 100 60" class="gauge-svg">
            <path
              class="arc-bg"
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke-width="${arcWidth}"
              stroke-linecap="round"
            ></path>
            
            <path
              class="arc-fg"
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="${color}"
              stroke-width="${arcWidth}"
              stroke-linecap="round"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${dashoffset}"
            ></path>
          </svg>
          
          <div class="value-container">
            <span class="value">${displayValue}</span>
            ${config.unit ? html`<span class="unit">${config.unit}</span>` : ''}
          </div>
          
          <div class="labels">
            <span class="min-label">${min}</span>
            <span class="max-label">${max}</span>
          </div>
        </div>
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
          align-items: center;
          gap: 16px;
        }
        .name {
          font-size: 14px;
          color: var(--secondary-text-color);
          font-weight: 500;
          align-self: flex-start;
        }
        .gauge-container {
          position: relative;
          width: 100%;
          max-width: 250px;
          aspect-ratio: 100 / 60;
        }
        .gauge-svg {
          width: 100%;
          height: 100%;
        }
        .arc-bg {
          stroke: var(--divider-color, #e0e0e0);
        }
        .arc-fg {
          transition: stroke-dashoffset 0.5s ease-in-out, stroke 0.5s ease-in-out;
        }
        .value-container {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .value {
          font-size: 28px;
          font-weight: 400;
          color: var(--primary-text-color);
          line-height: 1;
        }
        .unit {
          font-size: 14px;
          color: var(--secondary-text-color);
        }
        .labels {
          position: absolute;
          bottom: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 5%;
          box-sizing: border-box;
        }
        .min-label, .max-label {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
      `
    ];
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'prometheus-gauge-card',
  name: 'Prometheus Gauge',
  description: 'Display a Prometheus metric as a gauge',
  preview: true
});
