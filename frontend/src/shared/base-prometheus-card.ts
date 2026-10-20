import { LitElement, html, nothing, TemplateResult, PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { HomeAssistant, BaseCardConfig } from '../types';
import { PrometheusClient } from '../prometheus-client';
import { cardStyles } from './card-styles';
import { localize } from '../localize';
import { isDemoContext } from '../demo/demo-data';
import { migrateConfig, rowsForHeight } from '../utils/migrate';
import { usesVariables, VARIABLES_EVENT } from '../utils/variables';

const DEFAULT_REFRESH_INTERVAL = 30;

export abstract class BasePrometheusCard<C extends BaseCardConfig = BaseCardConfig> extends LitElement {
  @state() protected _config!: C;
  @state() protected _error?: string;
  @state() protected _loading: boolean = false;

  protected _hass?: HomeAssistant;
  private _interval?: number;
  private _cachedClient?: PrometheusClient;
  private _connected = false;
  private _demo?: boolean;
  private _observer?: IntersectionObserver;
  /** undefined until the observer reported once (then polling waits for visibility) */
  private _inViewport?: boolean;

  static styles = cardStyles;

  public setConfig(config: C): void {
    if (!config || !config.type) {
      throw new Error('Invalid configuration');
    }
    this._config = migrateConfig(config);
    this._error = undefined;
    this.toggleAttribute('transparent', Boolean(config.transparent));
    // Fixed panel height: cards of one row can be given exactly the same height.
    // Empty = auto (content height, or the height given by the Sections layout).
    const h = Number(this._config.card_height);
    this.style.height = h > 0 ? `${h}px` : '';
    this.toggleAttribute('fixed-height', this._fixedHeight());
    this._restart();
  }

  public set hass(hass: HomeAssistant) {
    const isFirstLoad = !this._hass;
    this._hass = hass;
    if (isFirstLoad) {
      this._restart();
    }
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
    document.addEventListener('visibilitychange', this._onVisibility);
    window.addEventListener(VARIABLES_EVENT, this._onVariables);
    this._observeViewport();
    this._restart();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._connected = false;
    document.removeEventListener('visibilitychange', this._onVisibility);
    window.removeEventListener(VARIABLES_EVENT, this._onVariables);
    this._observer?.disconnect();
    this._observer = undefined;
    this._stopAutoRefresh();
  }

  /** Pause polling on hidden tabs / screens off; refresh immediately when visible again. */
  private _onVisibility = () => {
    if (document.visibilityState === 'hidden') {
      this._stopAutoRefresh();
    } else {
      this._restart();
    }
  };

  /**
   * Cards outside the viewport are not polled (long dashboards, other views kept in the DOM).
   * They load when scrolled close to the screen (200px margin) and refresh on every return.
   */
  private _observeViewport() {
    if (typeof IntersectionObserver === 'undefined' || this._observer) return;
    this._observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        const first = this._inViewport === undefined;
        if (visible === this._inViewport) return;
        this._inViewport = visible;
        // first report "visible": connectedCallback has already fetched
        if (visible && !first) this._restart();
        else if (!visible) this._stopAutoRefresh();
      },
      { rootMargin: '200px' }
    );
    this._observer.observe(this);
  }

  /** A dashboard variable used by this card's query changed: fetch again at once. */
  private _onVariables = (ev: Event) => {
    const changed = (ev as CustomEvent<{ names: string[] }>).detail?.names || [];
    if (usesVariables(this._queryTemplate(), changed)) this._restart();
  };

  /** Query of the card before variables are substituted (substitution happens in the client). */
  protected _queryTemplate(): string {
    return this._config?.query || '';
  }

  /** Default width (of 12 columns) in the "Sections" dashboard view. */
  protected _defaultColumns(): number {
    return 6;
  }

  /** Sizes for the "Sections" view: rows follow `card_height`, otherwise auto. */
  public getGridOptions(): { columns?: number | 'full'; rows?: number | 'auto'; min_columns?: number; min_rows?: number } {
    const h = Number(this._config?.card_height);
    return { columns: this._defaultColumns(), rows: h > 0 ? rowsForHeight(h) : 'auto', min_columns: 3 };
  }

  /**
   * The panel height is given from outside (`card_height`, or rows set in the Sections layout
   * editor): charts then stretch to fill the panel instead of using their own default height.
   */
  protected _fixedHeight(): boolean {
    const c = this._config as BaseCardConfig & { grid_options?: { rows?: unknown } };
    return Number(c?.card_height) > 0 || typeof c?.grid_options?.rows === 'number';
  }

  /** Title of the panel. */
  protected get _title(): string {
    return (this._config?.title || '').trim();
  }

  /** Panel header: identical font / size / padding on every card. */
  protected renderHeader(extra: TemplateResult | typeof nothing = nothing): TemplateResult | typeof nothing {
    if (!this._title && extra === nothing) return nothing;
    return html`<div class="card-header">
      <span class="card-title" title=${this._title}>${this._title}</span>${extra}
    </div>`;
  }

  /** Whether the config contains enough info to query Prometheus. */
  protected _hasQuery(): boolean {
    return Boolean(this._config?.query && this._config.query.trim());
  }

  protected get _client(): PrometheusClient {
    const entryId = this._config.entry_id || undefined;
    const demo = this._isDemo();
    if (!this._cachedClient || this._cachedClient.entryId !== entryId || this._cachedClient.demo !== demo) {
      this._cachedClient = new PrometheusClient(this._hass!, entryId, demo);
    }
    return this._cachedClient;
  }

  /**
   * Previews in the dashboard "Add card" picker are rendered with built-in demo data,
   * so every card shows a meaningful picture regardless of the metrics on the server.
   */
  private _isDemo(): boolean {
    if (this._demo === undefined && this._connected) {
      this._demo = isDemoContext(this);
    }
    return Boolean(this._demo);
  }

  protected abstract _fetchData(): Promise<void>;

  protected async _safeFetch(): Promise<void> {
    if (!this._hass || !this._config || !this._hasQuery()) {
      return;
    }
    try {
      await this._fetchData();
    } catch (e: any) {
      this._error = this._formatError(e);
      this._loading = false;
    }
  }

  protected _formatError(e: any): string {
    if (!e) return 'Error';
    if (typeof e === 'string') return e;
    if (e.code === 'unknown_command') {
      return 'Prometheus Dashboard integration is not installed or not loaded';
    }
    return e.message || e.code || 'Error fetching data';
  }

  private _restart() {
    if (!this._hass || !this._config || !this._connected) {
      return;
    }
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }
    // off screen: wait until the card is scrolled into view (previews and the editor are never skipped)
    if (this._inViewport === false && !this._isDemo()) {
      return;
    }
    this._startAutoRefresh();
    this._safeFetch();
  }

  private _startAutoRefresh() {
    this._stopAutoRefresh();
    const seconds = Number(this._config.refresh_interval) || DEFAULT_REFRESH_INTERVAL;
    this._interval = window.setInterval(() => this._safeFetch(), Math.max(5, seconds) * 1000);
  }

  private _stopAutoRefresh() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return Boolean(this._config) && super.shouldUpdate(changedProps);
  }

  public getCardSize(): number {
    const h = Number(this._config?.card_height);
    return h > 0 ? Math.ceil(h / 50) : 3;
  }

  protected renderError(): TemplateResult {
    return html`<ha-card>${this.renderHeader()}<div class="error-state">${this._error}</div></ha-card>`;
  }

  protected renderLoading(): TemplateResult {
    return html`<ha-card>${this.renderHeader()}<div class="loading-state"></div></ha-card>`;
  }

  protected renderPlaceholder(key = 'no_query'): TemplateResult {
    return html`<ha-card>
      ${this.renderHeader()}
      <div class="placeholder-state">${localize(key, this._hass)}</div>
    </ha-card>`;
  }
}

