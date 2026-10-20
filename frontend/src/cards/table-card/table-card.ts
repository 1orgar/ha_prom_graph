import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePrometheusCard } from '../../shared/base-prometheus-card';
import { cardStyles } from '../../shared/card-styles';
import { BaseCardConfig, ThresholdConfig } from '../../types';
import { buildTable, TableModel } from './table-data';
import { formatValue } from '../../utils/format';
import { getThresholdColor, withAlpha } from '../../utils/color';
import { localize } from '../../localize';
import './table-card-editor';

export interface TableCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-table-card';
  columns?: string[];
  hide_columns?: string[];
  value_column?: string;
  sort_by?: 'value' | 'label';
  sort_dir?: 'asc' | 'desc';
  max_rows?: number;
  thresholds?: ThresholdConfig[];
  color_cells?: boolean;
}

@customElement('prometheus-table-card')
export class TableCard extends BasePrometheusCard<TableCardConfig> {
  @state() private _model: TableModel = { columns: [], rows: [] };
  @state() private _loaded = false;
  /** interactive sort (click on header) overrides the configured one */
  @state() private _sort?: { col: string; dir: 1 | -1 };

  static get styles() {
    return [
      cardStyles,
      css`
        ha-card { padding: 16px 0 8px; }
        .card-header { padding: 0 16px; }
        .wrap { overflow: auto; max-height: var(--table-max-height, 420px); }
        .wrap.fill { max-height: none; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { position: sticky; top: 0; background: var(--card-background-color, #fff); text-align: left;
          font-weight: 500; color: var(--secondary-text-color); padding: 6px 12px; cursor: pointer;
          white-space: nowrap; border-bottom: 1px solid var(--divider-color); user-select: none; }
        th.num, td.num { text-align: right; }
        td { padding: 5px 12px; border-bottom: 1px solid var(--divider-color); white-space: nowrap; }
        tr:last-child td { border-bottom: none; }
        td.num { font-weight: 600; font-variant-numeric: tabular-nums; }
        .arrow { opacity: 0.6; font-size: 10px; margin-left: 4px; }
      `
    ];
  }

  static getStubConfig(): Partial<TableCardConfig> {
    return {
      type: 'custom:prometheus-table-card',
      title: 'Targets',
      query: 'up',
      columns: ['job', 'instance'],
      thresholds: [{ value: 0, color: '#F2495C' }, { value: 1, color: '#73BF69' }],
      color_cells: true
    };
  }

  static getConfigElement() {
    return document.createElement('prometheus-table-card-editor');
  }

  protected _defaultColumns(): number {
    return 12;
  }

  protected async _fetchData(): Promise<void> {
    const c = this._config;
    try {
      this._loading = true;
      const res = await this._client.instantQuery(c.query!);
      this._model = buildTable(res, {
        columns: c.columns,
        hide: c.hide_columns,
        sortBy: c.sort_by,
        sortDir: c.sort_dir,
        maxRows: c.max_rows
      });
      this._error = undefined;
    } catch (e: any) {
      this._error = this._formatError(e);
    } finally {
      this._loading = false;
      this._loaded = true;
    }
  }

  private _rows() {
    const rows = [...this._model.rows];
    if (!this._sort) return rows;
    const { col, dir } = this._sort;
    return rows.sort((a, b) =>
      col === '__value__'
        ? dir * ((a.value ?? -Infinity) - (b.value ?? -Infinity))
        : dir * (a.labels[col] ?? '').localeCompare(b.labels[col] ?? '', undefined, { numeric: true })
    );
  }

  private _toggleSort(col: string) {
    this._sort = this._sort?.col === col ? { col, dir: this._sort.dir === 1 ? -1 : 1 } : { col, dir: col === '__value__' ? -1 : 1 };
  }

  private _th(col: string, title: string, num = false) {
    const arrow = this._sort?.col === col ? (this._sort.dir === 1 ? '▲' : '▼') : '';
    return html`<th class=${num ? 'num' : ''} @click=${() => this._toggleSort(col)}>
      ${title}${arrow ? html`<span class="arrow">${arrow}</span>` : nothing}
    </th>`;
  }

  render() {
    const c = this._config;
    if (!this._hasQuery()) return this.renderPlaceholder();
    if (this._error) return this.renderError();
    if (!this._loaded) return this.renderLoading();
    const { columns } = this._model;
    const rows = this._rows();
    return html`
      <ha-card>
        ${this.renderHeader()}
        ${rows.length
          ? html`<div class="wrap ${this._fixedHeight() ? 'fill' : ''}"><table>
              <thead><tr>
                ${columns.map((col) => this._th(col, col === '__name__' ? 'metric' : col))}
                ${this._th('__value__', c.value_column || localize('value', this._hass), true)}
              </tr></thead>
              <tbody>
                ${rows.map((r) => {
                  const color = c.thresholds?.length && r.value !== null ? getThresholdColor(r.value, c.thresholds) : '';
                  const style = color ? (c.color_cells ? `background:${withAlpha(color, 0.25)};color:${color}` : `color:${color}`) : '';
                  return html`<tr>
                    ${columns.map((col) => html`<td>${r.labels[col] ?? ''}</td>`)}
                    <td class="num" style=${style}>${formatValue(r.value, c.decimals, c.unit)}</td>
                  </tr>`;
                })}
              </tbody>
            </table></div>`
          : html`<div class="placeholder-state">${localize('no_data', this._hass)}</div>`}
      </ha-card>
    `;
  }
}
