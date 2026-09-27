import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, PrometheusEntry } from '../../types';
import { StatCardConfig } from './stat-card-config';
import { fireConfigChanged, editorStyles } from '../../shared/editor-utils';
import { PrometheusClient } from '../../prometheus-client';

@customElement('prometheus-stat-card-editor')
export class StatCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: StatCardConfig;
  @state() private _entries: PrometheusEntry[] = [];

  public setConfig(config: StatCardConfig): void {
    this._config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadEntries();
  }

  private async _loadEntries() {
    try {
      this._entries = await PrometheusClient.getEntries(this.hass);
    } catch (err) {
      console.error('Failed to load prometheus entries', err);
    }
  }

  private _valueChanged(ev: any): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : (target.type === 'number' ? Number(target.value) : target.value),
        };
      }
    }
    fireConfigChanged(this, this._config);
  }

  render() {
    if (!this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <ha-select
          label="Prometheus Instance"
          .configValue=${'entry_id'}
          .value=${this._config.entry_id || ''}
          @selected=${this._valueChanged}
          @closed=${(ev: Event) => ev.stopPropagation()}
        >
          ${this._entries.map(
            (entry) => html`<mwc-list-item value=${entry.entry_id}>${entry.title}</mwc-list-item>`
          )}
        </ha-select>

        <ha-textfield
          label="PromQL Query"
          .configValue=${'query'}
          .value=${this._config.query || ''}
          @input=${this._valueChanged}
        ></ha-textfield>

        <div class="side-by-side">
          <ha-textfield
            label="Name"
            .configValue=${'name'}
            .value=${this._config.name || ''}
            @input=${this._valueChanged}
          ></ha-textfield>
          
          <ha-textfield
            label="Icon (e.g. mdi:memory)"
            .configValue=${'icon'}
            .value=${this._config.icon || ''}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="side-by-side">
          <ha-textfield
            label="Unit"
            .configValue=${'unit'}
            .value=${this._config.unit || ''}
            @input=${this._valueChanged}
          ></ha-textfield>

          <ha-textfield
            label="Decimals"
            type="number"
            .configValue=${'decimals'}
            .value=${this._config.decimals !== undefined ? this._config.decimals : 1}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        
        <ha-textfield
          label="Refresh Interval (s)"
          type="number"
          .configValue=${'refresh_interval'}
          .value=${this._config.refresh_interval || 60}
          @input=${this._valueChanged}
        ></ha-textfield>

        <div class="switch-container">
          <ha-switch
            .checked=${this._config.sparkline !== false}
            .configValue=${'sparkline'}
            @change=${this._valueChanged}
          ></ha-switch>
          <span>Show Sparkline</span>
        </div>

        ${this._config.sparkline ? html`
          <ha-textfield
            label="Sparkline Hours"
            type="number"
            .configValue=${'sparkline_hours'}
            .value=${this._config.sparkline_hours || 24}
            @input=${this._valueChanged}
          ></ha-textfield>
        ` : ''}
      </div>
    `;
  }

  static get styles() {
    return [
      editorStyles,
      css`
        .card-config {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .side-by-side {
          display: flex;
          gap: 16px;
        }
        .side-by-side > * {
          flex: 1;
        }
        .switch-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `
    ];
  }
}
