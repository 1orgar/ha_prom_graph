import { customElement } from 'lit/decorators.js';
import { BarGaugeCardConfig } from './bar-gauge-card-config';
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

@customElement('prometheus-bar-gauge-card-editor')
export class BarGaugeCardEditor extends BasePrometheusEditor<BarGaugeCardConfig> {
  protected _defaults(): Partial<BarGaugeCardConfig> {
    return {
      min: 0,
      display_mode: 'gradient',
      show_unfilled: true,
      orientation: 'horizontal',
      sort: 'none',
      palette: 'classic',
      color_mode: 'thresholds',
      refresh_interval: 30
    };
  }

  private _options(prefix: string, values: string[]) {
    return values.map((value) => ({ value, label: localize(`${prefix}${value}`, this.hass) }));
  }

  protected _sections(): EditorSection[] {
    const horizontal = this._config?.orientation !== 'vertical';
    return [
      panelSection(),
      querySection(),
      displaySection(
        UNIT_SCHEMA,
        DECIMALS_SCHEMA,
        { name: 'display_mode', selector: { select: { mode: 'dropdown', options: this._options('display_mode_', ['gradient', 'basic', 'lcd']) } } },
        { name: 'orientation', selector: { select: { mode: 'dropdown', options: this._options('', ['horizontal', 'vertical']) } } },
        { name: 'min', selector: { number: { mode: 'box', step: 'any' } } },
        { name: 'max', selector: { number: { mode: 'box', step: 'any' } } },
        { name: 'show_unfilled', selector: { boolean: {} } },
        ...(horizontal
          ? [{ name: 'bar_height', selector: { number: { min: 4, max: 60, mode: 'box', unit_of_measurement: 'px' } } }]
          : []),
        { name: 'sort', selector: { select: { mode: 'dropdown', options: this._options('sort_', ['none', 'desc', 'asc', 'name']) } } },
        { name: 'limit', selector: { number: { min: 1, max: 100, mode: 'box' } } },
        colorModeSchema(this.hass),
        paletteSchema(this.hass)
      )
    ];
  }
}
