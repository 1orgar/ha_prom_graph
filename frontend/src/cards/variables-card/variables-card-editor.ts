import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import type { VariablesCardConfig } from './variables-card';
import { BasePrometheusEditor, EditorSection } from '../../shared/base-editor';
import { ENTRY_SCHEMA, REFRESH_SCHEMA, TITLE_SCHEMA, TRANSPARENT_SCHEMA } from '../../shared/editor-utils';
import { HaFormSchema } from '../../types';
import { localize } from '../../localize';
import '../../shared/list-editor';

const VARIABLE_SCHEMA: HaFormSchema[] = [
  {
    name: '',
    type: 'grid',
    schema: [
      { name: 'name', required: true, selector: { text: {} } },
      { name: 'label', selector: { text: {} } }
    ]
  },
  { name: 'query', selector: { text: { multiline: true } } },
  {
    name: '',
    type: 'grid',
    schema: [
      { name: 'label_name', selector: { text: {} } },
      { name: 'regex', selector: { text: {} } },
      { name: 'values', selector: { text: { multiple: true } } },
      { name: 'default', selector: { text: {} } },
      { name: 'multi', selector: { boolean: {} } },
      { name: 'include_all', selector: { boolean: {} } }
    ]
  }
];

@customElement('prometheus-variables-card-editor')
export class VariablesCardEditor extends BasePrometheusEditor<VariablesCardConfig> {
  protected _defaults(): Partial<VariablesCardConfig> {
    return { layout: 'row', refresh_interval: 300 };
  }

  protected _hasThresholds(): boolean {
    return false;
  }

  protected _canCreateAlert(): boolean {
    return false;
  }

  protected _sections(): EditorSection[] {
    const layouts = ['row', 'column'].map((value) => ({ value, label: localize(`layout_${value}`, this.hass) }));
    return [
      {
        title: 'section_panel',
        schema: [
          TITLE_SCHEMA,
          {
            name: '',
            type: 'grid',
            schema: [TRANSPARENT_SCHEMA, { name: 'layout', selector: { select: { mode: 'dropdown', options: layouts } } }]
          }
        ]
      },
      { title: 'section_query', schema: [ENTRY_SCHEMA, REFRESH_SCHEMA] }
    ];
  }

  protected _renderExtra() {
    const c = this._config!;
    return html`
      <div class="section-title">${localize('section_variables', this.hass)}</div>
      <div class="helper">${localize('helper_variables', this.hass)}</div>
      <prometheus-list-editor
        .hass=${this.hass}
        .items=${c.variables || []}
        .schema=${VARIABLE_SCHEMA}
        .entryId=${c.entry_id || undefined}
        .queryAlerts=${false}
        .itemTitle=${localize('variable_n', this.hass)}
        .newItem=${() => ({ name: `var${(c.variables?.length || 0) + 1}`, query: 'up', label_name: 'instance' })}
        .addLabel=${localize('add_variable', this.hass)}
        @value-changed=${(ev: CustomEvent) => {
          ev.stopPropagation();
          this._updateConfig({ variables: ev.detail.value } as Partial<VariablesCardConfig>);
        }}
      ></prometheus-list-editor>
    `;
  }
}
