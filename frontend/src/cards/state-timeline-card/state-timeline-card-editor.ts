import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateTimelineCardConfig } from './state-timeline-card-config';
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
import { HaFormSchema, ValueMapping } from '../../types';

const MAPPING_SCHEMA: HaFormSchema[] = [
  {
    name: '',
    type: 'grid',
    schema: [
      { name: 'value', selector: { text: {} } },
      { name: 'text', selector: { text: {} } },
      { name: 'from', selector: { number: { mode: 'box', step: 'any' } } },
      { name: 'to', selector: { number: { mode: 'box', step: 'any' } } },
      { name: 'color', selector: { text: { type: 'color' } } },
      { name: 'transparent_color', selector: { boolean: {} } }
    ]
  }
];

const toForm = (items: ValueMapping[] = []) =>
  items.map(({ transparent, ...rest }) => (transparent ? { ...rest, transparent_color: true } : rest));
const fromForm = (items: Record<string, unknown>[]) =>
  items.map(({ transparent_color, ...rest }) => (transparent_color ? { ...rest, transparent: true } : rest)) as ValueMapping[];

@customElement('prometheus-state-timeline-card-editor')
export class StateTimelineCardEditor extends BasePrometheusEditor<StateTimelineCardConfig> {
  protected _queryMode(): 'instant' | 'range' {
    return 'range';
  }

  protected _defaults(): Partial<StateTimelineCardConfig> {
    return {
      time_range: '6h',
      show_values: true,
      show_legend: true,
      merge_values: true,
      palette: 'classic',
      refresh_interval: 60
    };
  }

  protected _sections(): EditorSection[] {
    return [
      panelSection(),
      querySection({}, TIME_RANGE_SCHEMA, STEP_SCHEMA),
      displaySection(
        UNIT_SCHEMA,
        DECIMALS_SCHEMA,
        { name: 'row_height', selector: { number: { min: 6, max: 120, mode: 'box', unit_of_measurement: 'px' } } },
        paletteSchema(this.hass),
        { name: 'show_values', selector: { boolean: {} } },
        { name: 'show_legend', selector: { boolean: {} } },
        { name: 'merge_values', selector: { boolean: {} } }
      )
    ];
  }

  /** Value mappings belong to the display block (before thresholds). */
  protected _renderExtra() {
    return html`
      <div class="section-title">${localize('section_mappings', this.hass)}</div>
      <div class="helper">${localize('helper_mappings', this.hass)}</div>
      <prometheus-list-editor
        .hass=${this.hass}
        .items=${toForm(this._config?.mappings)}
        .schema=${MAPPING_SCHEMA}
        .addLabel=${localize('add_mapping', this.hass)}
        .newItem=${() => ({ value: '', text: '', color: '#73BF69' })}
        @value-changed=${(ev: CustomEvent) => {
          ev.stopPropagation();
          const items = fromForm(ev.detail.value as Record<string, unknown>[]);
          this._updateConfig({ mappings: items.length ? items : undefined });
        }}
      ></prometheus-list-editor>
    `;
  }
}
