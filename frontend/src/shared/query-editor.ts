import { LitElement, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { HomeAssistant } from '../types';
import { applySuggestion, CompletionContext, completionContext, Suggestion } from '../utils/promql';
import { localize } from '../localize';
import { suggest } from './query-suggest';
import { QueryTestResult, testQuery } from './query-test';
import { fireEvent } from './editor-utils';
import { queryEditorStyles } from './query-editor-styles';
import { PrometheusClient } from '../prometheus-client';
import { ALERT_CONDITIONS, ALERT_SEVERITIES, AlertDraft, alertDraft, canCreateAlerts, CONDITION_LABELS } from './create-alert';

type ActiveCtx = Exclude<CompletionContext, { kind: 'none' }>;

/**
 * PromQL input with autocompletion (metrics, functions, labels, label values)
 * and a "Test query" button. Fires `value-changed` with the new query.
 */
@customElement('prometheus-query-editor')
export class PrometheusQueryEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public value = '';
  @property() public label = '';
  @property({ attribute: false }) public entryId?: string;
  /** `range` tests with a short range query (time series-like cards) */
  @property() public mode: 'instant' | 'range' = 'instant';

  @state() private _items: Suggestion[] = [];
  @state() private _active = 0;
  @state() private _test?: QueryTestResult;
  @state() private _testing = false;
  /** "Create alert" button (PromQL alert of the integration from this query) */
  @property({ type: Boolean }) public alerts = true;
  /** prefill of the alert form (card title, first threshold) */
  @property({ attribute: false }) public alertDefaults?: AlertDraft;
  @state() private _alert?: AlertDraft;
  @state() private _alertResult?: QueryTestResult;
  @state() private _creating = false;
  @query('textarea') private _input!: HTMLTextAreaElement;

  private _ctx?: ActiveCtx;
  private _seq = 0;
  private _timer?: number;

  static styles = queryEditorStyles;

  private _emit(value: string) {
    this.value = value;
    fireEvent(this, 'value-changed', { value });
  }

  private _onInput() {
    this._emit(this._input.value);
    this._test = undefined;
    this._schedule();
  }

  private _schedule() {
    clearTimeout(this._timer);
    this._timer = window.setTimeout(() => this._complete(), 150);
  }

  private async _complete() {
    if (!this.hass || !this._input) return;
    const ctx = completionContext(this._input.value, this._input.selectionStart ?? this._input.value.length);
    if (ctx.kind === 'none') {
      this._close();
      return;
    }
    const seq = ++this._seq;
    const items = await suggest(this.hass, this.entryId, ctx);
    if (seq !== this._seq) return; // superseded by a newer keystroke
    this._ctx = ctx;
    this._items = items;
    this._active = 0;
  }

  private _close() {
    this._items = [];
    this._ctx = undefined;
  }

  private _pick(s: Suggestion) {
    if (!this._ctx) return;
    const pos = this._input.selectionStart ?? this._input.value.length;
    const r = applySuggestion(this._input.value, pos, this._ctx, s);
    this._input.value = r.text;
    this._input.setSelectionRange(r.cursor, r.cursor);
    this._emit(r.text);
    this._close();
    this._input.focus();
    // e.g. after `job="` suggest values right away
    this._schedule();
  }

  private _onKeyDown(ev: KeyboardEvent) {
    // keep HA dialogs from reacting to our keys
    ev.stopPropagation();
    if (ev.key === ' ' && ev.ctrlKey) {
      ev.preventDefault();
      this._complete();
      return;
    }
    if (!this._items.length) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      const d = ev.key === 'ArrowDown' ? 1 : -1;
      this._active = (this._active + d + this._items.length) % this._items.length;
      this.updateComplete.then(() => this.shadowRoot?.querySelector('.item.active')?.scrollIntoView({ block: 'nearest' }));
    } else if (ev.key === 'Enter' || ev.key === 'Tab') {
      ev.preventDefault();
      this._pick(this._items[this._active]);
    } else if (ev.key === 'Escape') {
      this._close();
    }
  }

  private async _runTest() {
    if (!this.hass || !this.value?.trim()) return;
    this._testing = true;
    this._test = await testQuery(this.hass, this.entryId, this.value, this.mode);
    this._testing = false;
  }

  private _openAlert() {
    this._alert = this._alert ? undefined : { ...(this.alertDefaults || alertDraft(undefined)) };
    this._alertResult = undefined;
  }

  private _alertField(field: keyof AlertDraft, ev: Event) {
    const raw = (ev.target as HTMLInputElement | HTMLSelectElement).value;
    const value = field === 'threshold' ? (raw === '' ? undefined : Number(raw)) : raw;
    this._alert = { ...this._alert!, [field]: value };
  }

  private async _createAlert() {
    const a = this._alert;
    if (!this.hass || !a || !a.name.trim() || !this.value?.trim()) return;
    this._creating = true;
    try {
      const res = await new PrometheusClient(this.hass, this.entryId, false, false).createAlert({
        name: a.name.trim(),
        query: this.value.trim(),
        condition: a.condition,
        ...(a.condition !== 'any' && a.threshold !== undefined ? { threshold: a.threshold } : {}),
        ...(a.for ? { for: a.for } : {}),
        severity: a.severity
      });
      this._alertResult = {
        ok: true,
        text: localize('alert_created', this.hass, { name: a.name.trim(), series: res.series, active: res.active })
      };
      this._alert = undefined;
    } catch (e: any) {
      const text = e?.code === 'unauthorized' ? localize('alert_admin_only', this.hass) : e?.message || e?.code || String(e);
      this._alertResult = { ok: false, text };
    }
    this._creating = false;
  }

  private _renderAlertForm() {
    const a = this._alert;
    if (!a) return nothing;
    const l = (k: string) => localize(k, this.hass);
    return html`<div class="alert-form" @keydown=${(e: Event) => e.stopPropagation()}>
      <div class="alert-title">${l('create_alert_title')}</div>
      <label class="wide">${l('alert_name')}
        <input .value=${a.name} @input=${(e: Event) => this._alertField('name', e)} />
      </label>
      <label>${l('alert_condition')}
        <select @change=${(e: Event) => this._alertField('condition', e)}>
          ${ALERT_CONDITIONS.map((c) => html`<option value=${c} ?selected=${a.condition === c}>${CONDITION_LABELS[c]}</option>`)}
        </select>
      </label>
      <label>${l('alert_threshold')}
        <input type="number" step="any" .value=${a.threshold === undefined ? '' : String(a.threshold)}
          ?disabled=${a.condition === 'any'} @input=${(e: Event) => this._alertField('threshold', e)} />
      </label>
      <label>${l('alert_for')}
        <input .value=${a.for} placeholder="5m" @input=${(e: Event) => this._alertField('for', e)} />
      </label>
      <label>${l('alert_severity')}
        <select @change=${(e: Event) => this._alertField('severity', e)}>
          ${ALERT_SEVERITIES.map((s) => html`<option value=${s} ?selected=${a.severity === s}>${s}</option>`)}
        </select>
      </label>
      <div class="alert-actions">
        <button class="test-btn" ?disabled=${this._creating || !a.name.trim()} @click=${this._createAlert}>
          ${l('create_alert')}
        </button>
        <button class="test-btn secondary" @click=${this._openAlert}>${l('cancel')}</button>
      </div>
    </div>`;
  }

  private _renderPopup() {
    if (!this._items.length) return nothing;
    const kind = (k: Suggestion['kind']) => (k === 'aggregation' ? 'agg' : k === 'function' ? 'fn' : k);
    return html`<div class="popup" @mousedown=${(e: Event) => e.preventDefault()}>
      ${this._items.map(
        (s, i) => html`<div class="item ${i === this._active ? 'active' : ''}" @click=${() => this._pick(s)}>
          <span class="kind">${kind(s.kind)}</span>
          <span class="value">${s.value}</span>
          ${s.detail ? html`<span class="detail" title=${s.detail}>${s.detail}</span>` : nothing}
        </div>`
      )}
    </div>`;
  }

  render() {
    const t = this._test;
    return html`
      ${this.label ? html`<div class="label">${this.label}</div>` : nothing}
      <textarea
        spellcheck="false"
        .value=${this.value || ''}
        placeholder="rate(node_network_receive_bytes_total[5m])"
        @input=${this._onInput}
        @keydown=${this._onKeyDown}
        @click=${this._schedule}
        @blur=${() => setTimeout(() => this._close(), 150)}
      ></textarea>
      ${this._renderPopup()}
      <div class="toolbar">
        <button class="test-btn" ?disabled=${this._testing || !this.value?.trim()} @click=${this._runTest}>
          ${this._testing ? localize('testing', this.hass) : localize('test_query', this.hass)}
        </button>
        ${this.alerts && canCreateAlerts(this.hass)
          ? html`<button class="test-btn" ?disabled=${!this.value?.trim()} @click=${this._openAlert}>
              ${localize('create_alert', this.hass)}
            </button>`
          : nothing}
        <span class="hint">${localize('autocomplete_hint', this.hass)}</span>
      </div>
      ${t
        ? html`<div class="result ${t.ok ? 'ok' : 'err'}">
            ${t.text}
            ${t.samples?.length ? html`<ul>${t.samples.map((s) => html`<li><code>${s}</code></li>`)}</ul>` : nothing}
          </div>`
        : nothing}
      ${this._renderAlertForm()}
      ${this._alertResult
        ? html`<div class="result ${this._alertResult.ok ? 'ok' : 'err'}">${this._alertResult.text}</div>`
        : nothing}
    `;
  }
}
