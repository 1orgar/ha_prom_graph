import { customElement } from 'lit/decorators.js';
import { PieChartCardConfig } from './pie-chart-card-config';
import { BasePrometheusEditor, EditorSection } from '../../shared/base-editor';
import { DECIMALS_SCHEMA, displaySection, panelSection, paletteSchema, querySection, UNIT_SCHEMA } from '../../shared/editor-utils';
import { localize } from '../../localize';

@customElement('prometheus-pie-card-editor')
export class PieChartCardEditor extends BasePrometheusEditor<PieChartCardConfig> {
  protected _defaults(): Partial<PieChartCardConfig> {
    return {
      pie_type: 'donut',
      donut_width: 40,
      show_legend: true,
      legend_position: 'right',
      legend_values: ['value'],
      show_labels: false,
      show_total: true,
      sort: 'desc',
      size: 180,
      palette: 'classic',
      refresh_interval: 30
    };
  }

  /** Pie has no thresholds. */
  protected _hasThresholds(): boolean {
    return false;
  }

  private _options(prefix: string, values: string[]) {
    return values.map((value) => ({ value, label: localize(`${prefix}${value}`, this.hass) }));
  }

  protected _sections(): EditorSection[] {
    const donut = this._config?.pie_type !== 'pie';
    const legend = this._config?.show_legend !== false;
    return [
      panelSection(),
      querySection(),
      displaySection(
        UNIT_SCHEMA,
        DECIMALS_SCHEMA,
        { name: 'pie_type', selector: { select: { mode: 'dropdown', options: this._options('pie_type_', ['donut', 'pie']) } } },
        ...(donut
          ? [
              { name: 'donut_width', selector: { number: { min: 10, max: 90, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
              { name: 'show_total', selector: { boolean: {} } }
            ]
          : []),
        { name: 'show_labels', selector: { boolean: {} } },
        { name: 'size', selector: { number: { min: 80, max: 500, mode: 'box', unit_of_measurement: 'px' } } },
        { name: 'sort', selector: { select: { mode: 'dropdown', options: this._options('sort_', ['desc', 'asc', 'none']) } } },
        { name: 'limit', selector: { number: { min: 1, max: 50, mode: 'box' } } },
        paletteSchema(this.hass),
        { name: 'show_legend', selector: { boolean: {} } },
        ...(legend
          ? [
              {
                name: 'legend_position',
                selector: { select: { mode: 'dropdown', options: this._options('legend_position_', ['right', 'bottom']) } }
              },
              {
                name: 'legend_values',
                selector: { select: { multiple: true, mode: 'list', options: this._options('legend_pie_', ['value', 'percent']) } }
              }
            ]
          : [])
      )
    ];
  }
}
