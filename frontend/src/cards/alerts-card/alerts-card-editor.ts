import { customElement } from 'lit/decorators.js';
import type { AlertsCardConfig } from './alerts-card';
import { BasePrometheusEditor, EditorSection } from '../../shared/base-editor';
import { displaySection, panelSection, querySection } from '../../shared/editor-utils';
import { localize } from '../../localize';

@customElement('prometheus-alerts-card-editor')
export class AlertsCardEditor extends BasePrometheusEditor<AlertsCardConfig> {
  protected _defaults(): Partial<AlertsCardConfig> {
    return {
      states: ['firing', 'pending'],
      source: '',
      show_annotations: true,
      show_labels: false,
      group_by_name: false,
      refresh_interval: 30
    };
  }

  protected _canCreateAlert(): boolean {
    return false;
  }

  /** Alerts have their own severity colours. */
  protected _hasThresholds(): boolean {
    return false;
  }

  protected _sections(): EditorSection[] {
    const states = ['firing', 'pending', 'inactive'].map((value) => ({ value, label: localize(`state_${value}`, this.hass) }));
    const sources = ['', 'prometheus', 'local'].map((value) => ({ value, label: localize(`source_${value || 'all'}`, this.hass) }));
    // "query" of the alerts panel = which alerts are taken from the server
    const q = querySection(
      { legend: false, query: false },
      { name: 'source', selector: { select: { mode: 'dropdown', options: sources } } },
      { name: 'min_active', selector: { text: {} } },
      { name: 'severities', selector: { text: {} } },
      { name: 'name_filter', selector: { text: {} } }
    );
    q.schema.push({ name: 'states', selector: { select: { multiple: true, mode: 'list', options: states } } });
    return [
      panelSection(),
      q,
      displaySection(
        { name: 'show_annotations', selector: { boolean: {} } },
        { name: 'show_labels', selector: { boolean: {} } },
        { name: 'group_by_name', selector: { boolean: {} } },
        { name: 'max_rows', selector: { number: { min: 1, max: 200, mode: 'box' } } }
      )
    ];
  }
}
