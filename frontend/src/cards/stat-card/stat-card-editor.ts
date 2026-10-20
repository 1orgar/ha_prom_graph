import { customElement } from 'lit/decorators.js';
import { StatCardConfig } from './stat-card-config';
import { BasePrometheusEditor, EditorSection } from '../../shared/base-editor';
import {
  colorModeSchema,
  DECIMALS_SCHEMA,
  displaySection,
  panelSection,
  paletteSchema,
  querySection,
  UNIT_SCHEMA
} from '../../shared/editor-utils';
import { localize } from '../../localize';
import { HaFormSchema } from '../../types';

@customElement('prometheus-stat-card-editor')
export class StatCardEditor extends BasePrometheusEditor<StatCardConfig> {
  protected _queryMode(): 'instant' | 'range' {
    return this._config?.sparkline ? 'range' : 'instant';
  }

  protected _defaults(): Partial<StatCardConfig> {
    return {
      refresh_interval: 30,
      sparkline: false,
      sparkline_hours: 24,
      line_width: 2,
      sparkline_fill: true,
      reduce: 'none',
      layout: 'default',
      tile_style: 'gradient',
      palette: 'classic',
      color_mode: 'thresholds'
    };
  }

  private _options(prefix: string, values: string[]) {
    return values.map((value) => ({ value, label: localize(`${prefix}${value}`, this.hass) }));
  }

  protected _sections(): EditorSection[] {
    const c = this._config;
    const tiles = c?.layout === 'tiles';
    const sparkline: HaFormSchema[] = c?.sparkline
      ? [
          { name: 'line_width', selector: { number: { min: 1, max: 10, step: 0.5, mode: 'slider', unit_of_measurement: 'px' } } },
          { name: 'sparkline_fill', selector: { boolean: {} } }
        ]
      : [];
    const reduceOptions = this._options('reduce_', ['none', 'sum', 'avg', 'min', 'max']);

    return [
      panelSection(...(tiles ? [] : [{ name: 'icon', selector: { icon: {} } }])),
      querySection(
        {},
        { name: 'reduce', selector: { select: { mode: 'dropdown', options: reduceOptions } } },
        { name: 'sparkline', selector: { boolean: {} } },
        ...(c?.sparkline
          ? [{ name: 'sparkline_hours', selector: { number: { min: 1, max: 720, mode: 'box', unit_of_measurement: 'h' } } }]
          : [])
      ),
      displaySection(
        UNIT_SCHEMA,
        DECIMALS_SCHEMA,
        { name: 'layout', selector: { select: { mode: 'dropdown', options: this._options('layout_', ['default', 'tiles']) } } },
        ...(tiles
          ? [
              { name: 'tile_style', selector: { select: { mode: 'dropdown', options: this._options('tile_style_', ['gradient', 'solid']) } } },
              { name: 'tile_height', selector: { number: { min: 40, max: 600, mode: 'box', unit_of_measurement: 'px' } } },
              { name: 'tile_min_width', selector: { number: { min: 60, max: 600, mode: 'box', unit_of_measurement: 'px' } } }
            ]
          : []),
        colorModeSchema(this.hass),
        paletteSchema(this.hass),
        ...sparkline
      )
    ];
  }
}
