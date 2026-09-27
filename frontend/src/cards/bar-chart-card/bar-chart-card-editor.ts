import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BarChartCardConfig } from './bar-chart-card-config';
import { fireConfigChanged, editorStyles } from '../../shared/editor-utils';
import { HomeAssistant } from '../../types';

@customElement('prometheus-bar-card-editor')
export class BarChartCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) _config?: BarChartCardConfig;

  static get styles() {
    return [editorStyles];
  }

  public setConfig(config: BarChartCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: any): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    
    let newValue: any = target.value;
    if (target.type === 'number') {
      newValue = Number(newValue);
    } else if (target.type === 'checkbox') {
      newValue = target.checked;
    }

    if (target.configValue) {
      if (newValue === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue as keyof BarChartCardConfig];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: newValue,
        };
      }
    }
    fireConfigChanged(this, this._config);
  }

  protected render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="row">
          <ha-textfield
            label="Entry ID (Prometheus integration)"
            .value=${this._config.entry_id || ''}
            .configValue=${'entry_id'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-textfield
            label="Name"
            .value=${this._config.name || ''}
            .configValue=${'name'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-textarea
            label="PromQL Query"
            .value=${this._config.query || ''}
            .configValue=${'query'}
            @input=${this._valueChanged}
          ></ha-textarea>
        </div>
        <div class="row">
          <ha-textfield
            label="Group By (Label)"
            .value=${this._config.group_by || ''}
            .configValue=${'group_by'}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-select
            label="Orientation"
            .value=${this._config.orientation || 'horizontal'}
            .configValue=${'orientation'}
            @closed=${(ev: any) => ev.stopPropagation()}
            @change=${this._valueChanged}
          >
            <mwc-list-item value="horizontal">Horizontal</mwc-list-item>
            <mwc-list-item value="vertical">Vertical</mwc-list-item>
          </ha-select>
        </div>
        <div class="row">
          <ha-textfield
            label="Unit"
            .value=${this._config.unit || ''}
            .configValue=${'unit'}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Max Value (for scale)"
            type="number"
            .value=${this._config.max || ''}
            .configValue=${'max'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-textfield
            label="Bar Height (px)"
            type="number"
            .value=${this._config.bar_height || 24}
            .configValue=${'bar_height'}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Refresh Interval (s)"
            type="number"
            .value=${this._config.refresh_interval || 60}
            .configValue=${'refresh_interval'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-formfield label="Show Values">
            <ha-switch
              .checked=${this._config.show_values !== false}
              .configValue=${'show_values'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>
        <!-- Thresholds editor could be added here if needed, keeping it simple for now -->
      </div>
    `;
  }
}
