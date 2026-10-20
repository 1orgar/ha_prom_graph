import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { BaseCardConfig } from '../../types';
import {
  ALL_VALUE,
  getVariable,
  setVariableOptions,
  setVariables,
  VariableValue
} from '../../utils/variables';
import { guessLabel, labelValues, resolveValue, VariableConfig } from './variables-data';
import { localize } from '../../localize';
import './variables-card-editor';

export interface VariablesCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-variables-card';
  variables: VariableConfig[];
  /** `row` (default) or `column` */
  layout?: 'row' | 'column';
}

/**
 * Dashboard variables (like Grafana): drop-downs whose values are substituted into the queries
 * of all Prometheus cards of the page, e.g. `rate(node_cpu_seconds_total{instance=~"$instance"}[5m])`.
 * A variable whose query uses another one (`up{job="$job"}`) reloads its values when that changes.
 */
@customElement('prometheus-variables-card')
export class VariablesCard extends BasePrometheusCard<VariablesCardConfig> {
  @state() private _options: Record<string, string[]> = {};
  @state() private _values: Record<string, VariableValue> = {};
  @state() private _loaded = false;

  static get styles() {
    return [
      cardStyles,
      css`
        ha-card { padding: 12px 16px; }
        .vars { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: flex-end; }
        .vars.column { flex-direction: column; align-items: stretch; }
        label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--secondary-text-color); min-width: 140px; }
        select {
          font: inherit; font-size: 14px; color: var(--primary-text-color);
          background: var(--input-fill-color, var(--secondary-background-color, rgba(127, 127, 127, 0.1)));
          border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3)); border-radius: 6px; padding: 6px 8px;
        }
        select[multiple] { min-height: 64px; }
        .err { color: var(--error-color, #db4437); font-size: 12px; margin-top: 6px; }
      `
    ];
  }

  static getStubConfig(): Partial<VariablesCardConfig> {
    return {
      type: 'custom:prometheus-variables-card',
      variables: [{ name: 'instance', label: 'Instance', query: 'up', label_name: 'instance', include_all: true, multi: true }]
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-variables-card-editor');
  }

  public setConfig(config: VariablesCardConfig): void {
    super.setConfig({ ...config, variables: Array.isArray(config.variables) ? config.variables : [] });
  }

  protected _defaultColumns(): number {
    return 12;
  }

  public getCardSize(): number {
    return 1;
  }

  /** Always "fetch": variables without a query have fixed values. */
  protected _hasQuery(): boolean {
    return (this._config.variables || []).length > 0;
  }

  protected _queryTemplate(): string {
    return (this._config.variables || []).map((v) => v.query || '').join('\n');
  }

  protected async _fetchData(): Promise<void> {
    const options: Record<string, string[]> = {};
    const values: Record<string, VariableValue> = {};
    const errors: string[] = [];
    // in order: a variable's query can use the variables before it
    for (const v of this._config.variables) {
      if (!v.name) continue;
      let list: string[] = (v.values || []).map(String);
      if (v.query) {
        try {
          const res = await this._client.instantQuery(v.query);
          const label = guessLabel(res, v);
          list = label ? labelValues(res, label, v.regex) : [];
        } catch (e) {
          errors.push(`${v.name}: ${this._formatError(e)}`);
        }
      }
      options[v.name] = list;
      // previews in the card picker run in the same page: never touch the real variables
      const demo = this._client.demo;
      values[v.name] = resolveValue(v, list, demo ? this._values[v.name] : getVariable(v.name));
      if (!demo) {
        setVariableOptions(v.name, list);
        setVariables({ [v.name]: values[v.name] });
      }
    }
    this._options = options;
    this._values = values;
    this._error = errors.length ? errors.join('; ') : undefined;
    this._loaded = true;
  }

  private _change(v: VariableConfig, ev: Event) {
    const select = ev.target as HTMLSelectElement;
    let value: VariableValue = v.multi ? [...select.selectedOptions].map((o) => o.value) : select.value;
    // "All" together with single values: the last choice wins
    if (Array.isArray(value) && value.length > 1 && value.includes(ALL_VALUE)) {
      const hadAll = ([] as string[]).concat(this._values[v.name] || []).includes(ALL_VALUE);
      value = hadAll ? value.filter((x) => x !== ALL_VALUE) : [ALL_VALUE];
    }
    this._values = { ...this._values, [v.name]: value };
    if (this._client.demo) return;
    // variables whose query uses this one (`up{job=~"$job"}`) reload through the change event
    // (see `_queryTemplate`); unchanged values fire no event, so there is no loop
    setVariables({ [v.name]: value });
  }

  private _renderVariable(v: VariableConfig) {
    const options = this._options[v.name] || [];
    const current = this._values[v.name];
    const selected = (x: string) => (Array.isArray(current) ? current.includes(x) : current === x);
    return html`<label>
      ${v.label || v.name}
      <select ?multiple=${Boolean(v.multi)} @change=${(e: Event) => this._change(v, e)}>
        ${v.include_all
          ? html`<option value=${ALL_VALUE} ?selected=${selected(ALL_VALUE)}>${localize('var_all', this._hass)}</option>`
          : nothing}
        ${options.map((o) => html`<option value=${o} ?selected=${selected(o)}>${o}</option>`)}
      </select>
    </label>`;
  }

  protected render() {
    const c = this._config;
    if (!c.variables.length) return this.renderPlaceholder('no_variables');
    return html`
      <ha-card>
        ${this.renderHeader()}
        <div class="vars ${c.layout === 'column' ? 'column' : ''}">
          ${c.variables.filter((v) => v.name).map((v) => this._renderVariable(v))}
        </div>
        ${this._error ? html`<div class="err">${this._error}</div>` : nothing}
        ${!this._loaded && !this._error ? html`<div class="loading-state"></div>` : nothing}
      </ha-card>
    `;
  }
}

