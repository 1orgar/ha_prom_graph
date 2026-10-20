import { customElement } from 'lit/decorators.js';
import { GaugeCardConfig } from './gauge-card-config';
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

@customElement('prometheus-gauge-card-editor')
export class GaugeCardEditor extends BasePrometheusEditor<GaugeCardConfig> {
  protected _defaults(): Partial<GaugeCardConfig> {
    return {
      min: 0,
      max: 100,
      arc_width: 8,
      refresh_interval: 30,
      show_labels: true,
      show_unfilled: true,
      palette: 'classic',
      color_mode: 'thresholds'
    };
  }

  protected _sections(): EditorSection[] {
    return [
      panelSection(),
      querySection(),
      displaySection(
        UNIT_SCHEMA,
        DECIMALS_SCHEMA,
        { name: 'min', selector: { number: { mode: 'box', step: 'any' } } },
        { name: 'max', selector: { number: { mode: 'box', step: 'any' } } },
        { name: 'arc_width', selector: { number: { min: 2, max: 20, step: 1, mode: 'slider' } } },
        { name: 'show_unfilled', selector: { boolean: {} } },
        { name: 'show_labels', selector: { boolean: {} } },
        colorModeSchema(this.hass),
        paletteSchema(this.hass)
      )
    ];
  }
}
