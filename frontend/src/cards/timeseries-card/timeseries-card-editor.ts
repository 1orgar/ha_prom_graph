import { customElement } from 'lit/decorators.js';
import { TimeseriesCardConfig } from './timeseries-card-config';
import { BasePrometheusEditor, EditorSection } from '../../shared/base-editor';
import {
  DECIMALS_SCHEMA,
  displaySection,
  panelSection,
  paletteSchema,
  querySection,
  STEP_SCHEMA,
  TIME_RANGE_SCHEMA,
  UNIT_SCHEMA
} from '../../shared/editor-utils';
import { localize } from '../../localize';
import { HaFormSchema } from '../../types';

@customElement('prometheus-timeseries-card-editor')
export class TimeseriesCardEditor extends BasePrometheusEditor<TimeseriesCardConfig> {
  protected _queryMode(): 'instant' | 'range' {
    return 'range';
  }

  protected _defaults(): Partial<TimeseriesCardConfig> {
    return {
      time_range: '1h',
      show_legend: true,
      show_current: false,
      legend_mode: 'list',
      fill: false,
      fill_opacity: 20,
      line_width: 2,
      stacked: false,
      show_x_axis: true,
      show_y_axis: true,
      show_grid: true,
      palette: 'classic',
      threshold_style: 'off',
      refresh_interval: 30
    };
  }

  private _options(prefix: string, values: string[]) {
    return values.map((value) => ({ value, label: localize(`${prefix}${value}`, this.hass) }));
  }

  protected _sections(): EditorSection[] {
    const c = this._config;
    const fill = c?.fill || c?.stacked;
    const table = c?.legend_mode === 'table';
    const legend = c?.show_legend !== false;
    const autoHeight = !c?.card_height;
    const legendFields: HaFormSchema[] = legend
      ? [
          { name: 'legend_mode', selector: { select: { mode: 'dropdown', options: this._options('legend_mode_', ['list', 'table']) } } },
          { name: 'show_current', selector: { boolean: {} } }
        ]
      : [];
    return [
      panelSection(),
      querySection({}, TIME_RANGE_SCHEMA, STEP_SCHEMA),
      displaySection(
        UNIT_SCHEMA,
        DECIMALS_SCHEMA,
        paletteSchema(this.hass),
        { name: 'line_width', selector: { number: { min: 0.5, max: 10, step: 0.5, mode: 'slider', unit_of_measurement: 'px' } } },
        { name: 'fill', selector: { boolean: {} } },
        { name: 'stacked', selector: { boolean: {} } },
        ...(fill
          ? [{ name: 'fill_opacity', selector: { number: { min: 0, max: 100, step: 5, mode: 'slider', unit_of_measurement: '%' } } }]
          : []),
        { name: 'min', selector: { number: { mode: 'box', step: 'any' } } },
        { name: 'max', selector: { number: { mode: 'box', step: 'any' } } },
        { name: 'show_x_axis', selector: { boolean: {} } },
        { name: 'show_y_axis', selector: { boolean: {} } },
        { name: 'show_grid', selector: { boolean: {} } },
        ...(autoHeight ? [{ name: 'height', selector: { number: { min: 60, max: 1000, mode: 'box', unit_of_measurement: 'px' } } }] : []),
        { name: 'show_legend', selector: { boolean: {} } },
        ...legendFields,
        {
          name: 'threshold_style',
          selector: { select: { mode: 'dropdown', options: this._options('threshold_style_', ['off', 'line', 'area']) } }
        }
      ),
      ...(legend && table
        ? [
            {
              schema: [
                {
                  name: 'legend_values',
                  selector: {
                    select: { multiple: true, mode: 'list', options: this._options('legend_value_', ['last', 'min', 'max', 'mean']) }
                  }
                }
              ]
            }
          ]
        : [])
    ];
  }
}
