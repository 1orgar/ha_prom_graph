import { LitElement, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, BaseCardConfig } from '../types';
import { PrometheusClient } from '../prometheus-client';
import { cardStyles } from './card-styles';

export abstract class BasePrometheusCard extends LitElement {
  @property({ attribute: false }) public _hass!: HomeAssistant;
  @state() protected _config!: BaseCardConfig;
  @state() protected _error?: string;
  @state() protected _loading: boolean = false;
  
  private _interval?: number;
  private _cachedClient?: PrometheusClient;

  static styles = cardStyles;

  public setConfig(config: BaseCardConfig): void {
    if (!config.type) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
    if (this._hass) {
      this._startAutoRefresh();
      this._fetchData();
    }
  }

  public set hass(hass: HomeAssistant) {
    const isFirstLoad = !this._hass;
    this._hass = hass;
    if (isFirstLoad && this._config) {
      this._startAutoRefresh();
      this._fetchData();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._hass && this._config) {
      this._startAutoRefresh();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAutoRefresh();
  }

  protected get _client(): PrometheusClient {
    if (!this._cachedClient || this._config.entry_id !== (this._cachedClient as any).entryId) {
      const entryId = this._config.entry_id || 'default';
      this._cachedClient = new PrometheusClient(this._hass, entryId);
    }
    return this._cachedClient;
  }

  protected abstract _fetchData(): Promise<void>;

  private _startAutoRefresh() {
    this._stopAutoRefresh();
    const interval = (this._config.refresh_interval || 30) * 1000;
    this._interval = window.setInterval(() => this._fetchData(), interval);
  }

  private _stopAutoRefresh() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }

  public getCardSize(): number {
    return 3;
  }

  protected renderError(): TemplateResult {
    return html`
      <ha-card>
        <div class="error-state">
          ${this._error}
        </div>
      </ha-card>
    `;
  }

  protected renderLoading(): TemplateResult {
    return html`
      <ha-card>
        <div class="loading-state"></div>
      </ha-card>
    `;
  }
}
