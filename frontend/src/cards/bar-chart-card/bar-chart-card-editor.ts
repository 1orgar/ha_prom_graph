import { customElement } from 'lit/decorators.js';
import { BarChartCardConfig } from './bar-chart-card-config';
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

@customElement('prometheus-bar-card-editor')
export class BarChartCardEditor extends BasePrometheusEditor<BarChartCardConfig> {
  protected _defaults(): Partial<BarChartCardConfig> {
    return {
      orientation: 'horizontal',
      show_values: true,
      transparent_track: false,
      value_at_end: false,
      gradient: false,
      refresh_interval: 30,
      sort: 'desc',
      palette: 'classic',
      color_mode: 'thresholds'
    };
  }

  private _options(prefix: string, values: string[]) {
    return values.map((value) => ({ value, label: localize(`${prefix}${value}`, this.hass) }));
  }

  protected _sections(): EditorSection[] {
    const c = this._config;
    const horizontal = c?.orientation !== 'vertical';
    return [
      panelSection(),
      querySection(),
      displaySection(
        UNIT_SCHEMA,
        DECIMALS_SCHEMA,
        { name: 'orientation', selector: { select: { mode: 'dropdown', options: this._options('', ['horizontal', 'vertical']) } } },
        { name: 'sort', selector: { select: { mode: 'dropdown', options: this._options('sort_', ['desc', 'asc', 'name', 'none']) } } },
        { name: 'limit', selector: { number: { min: 1, max: 100, mode: 'box' } } },
        { name: 'max', selector: { number: { mode: 'box', step: 'any' } } },
        ...(horizontal
          ? [{ name: 'bar_height', selector: { number: { min: 4, max: 80, mode: 'box', unit_of_measurement: 'px' } } }]
          : []),
        { name: 'show_values', selector: { boolean: {} } },
        { name: 'transparent_track', selector: { boolean: {} } },
        ...(c?.transparent_track && c?.show_values !== false ? [{ name: 'value_at_end', selector: { boolean: {} } }] : []),
        colorModeSchema(this.hass),
        ...(c?.color_mode !== 'series' ? [{ name: 'gradient', selector: { boolean: {} } }] : []),
        paletteSchema(this.hass)
      )
    ];
  }
}
