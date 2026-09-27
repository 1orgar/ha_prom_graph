import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TimeseriesCardConfig } from './timeseries-card-config';
import { fireConfigChanged, editorStyles } from '../../shared/editor-utils';
import { HomeAssistant } from '../../types';

@customElement('prometheus-timeseries-card-editor')
export class TimeseriesCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) _config?: TimeseriesCardConfig;

  static get styles() {
    return [
      editorStyles,
      css`
        .series-item {
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 8px;
        }
        .series-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-weight: 500;
        }
      `
    ];
  }

  public setConfig(config: TimeseriesCardConfig): void {
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
        delete tmpConfig[target.configValue as keyof TimeseriesCardConfig];
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

  private _seriesValueChanged(index: number, ev: any): void {
    if (!this._config || !this._config.series) return;
    const target = ev.target;
    const field = target.configValue;
    
    let newValue: any = target.value;
    if (target.type === 'checkbox') {
      newValue = target.checked;
    }

    const newSeries = [...this._config.series];
    newSeries[index] = { ...newSeries[index], [field]: newValue };
    
    this._config = { ...this._config, series: newSeries };
    fireConfigChanged(this, this._config);
  }

  private _addSeries(): void {
    if (!this._config) return;
    const series = this._config.series ? [...this._config.series] : [];
    series.push({ query: '', name: `Series ${series.length + 1}` });
    this._config = { ...this._config, series };
    fireConfigChanged(this, this._config);
  }

  private _removeSeries(index: number): void {
    if (!this._config || !this._config.series) return;
    const series = [...this._config.series];
    series.splice(index, 1);
    this._config = { ...this._config, series };
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
            label="Title (Optional)"
            .value=${this._config.title || ''}
            .configValue=${'title'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-select
            label="Time Range"
            .value=${this._config.time_range || '1h'}
            .configValue=${'time_range'}
            @closed=${(ev: any) => ev.stopPropagation()}
            @change=${this._valueChanged}
          >
            <mwc-list-item value="1h">1 Hour</mwc-list-item>
            <mwc-list-item value="6h">6 Hours</mwc-list-item>
            <mwc-list-item value="12h">12 Hours</mwc-list-item>
            <mwc-list-item value="24h">24 Hours</mwc-list-item>
            <mwc-list-item value="2d">2 Days</mwc-list-item>
            <mwc-list-item value="7d">7 Days</mwc-list-item>
            <mwc-list-item value="30d">30 Days</mwc-list-item>
          </ha-select>
          <ha-textfield
            label="Refresh Interval (s)"
            type="number"
            .value=${this._config.refresh_interval || 60}
            .configValue=${'refresh_interval'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-textfield
            label="Unit"
            .value=${this._config.unit || ''}
            .configValue=${'unit'}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Height (px)"
            type="number"
            .value=${this._config.height || 200}
            .configValue=${'height'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-formfield label="Show Legend">
            <ha-switch
              .checked=${this._config.show_legend !== false}
              .configValue=${'show_legend'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Fill (Area)">
            <ha-switch
              .checked=${this._config.fill === true}
              .configValue=${'fill'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>

        <div class="section-title">Series</div>
        ${this._config.series?.map((s, i) => html`
          <div class="series-item">
            <div class="series-header">
              <span>Series ${i + 1}</span>
              <ha-icon-button
                .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
                @click=${() => this._removeSeries(i)}
                title="Remove series"
              ></ha-icon-button>
            </div>
            <div class="row">
              <ha-textarea
                label="PromQL Query"
                .value=${s.query || ''}
                .configValue=${'query'}
                @input=${(ev: any) => this._seriesValueChanged(i, ev)}
              ></ha-textarea>
            </div>
            <div class="row">
              <ha-textfield
                label="Name"
                .value=${s.name || ''}
                .configValue=${'name'}
                @input=${(ev: any) => this._seriesValueChanged(i, ev)}
              ></ha-textfield>
              <ha-textfield
                label="Color"
                .value=${s.color || ''}
                .configValue=${'color'}
                @input=${(ev: any) => this._seriesValueChanged(i, ev)}
              ></ha-textfield>
            </div>
          </div>
        `)}
        
        <mwc-button @click=${this._addSeries}>Add Series</mwc-button>
      </div>
    `;
  }
}
