import { customElement } from 'lit/decorators.js';
import type { HeatmapCardConfig } from './heatmap-card';
import { BasePrometheusEditor, EditorSection } from '../../shared/base-editor';
import {
  DECIMALS_SCHEMA,
  displaySection,
  panelSection,
  querySection,
  TIME_RANGE_SCHEMA,
  UNIT_SCHEMA
} from '../../shared/editor-utils';
import { localize } from '../../localize';

@customElement('prometheus-heatmap-card-editor')
export class HeatmapCardEditor extends BasePrometheusEditor<HeatmapCardConfig> {
  protected _queryMode(): 'instant' | 'range' {
    return 'range';
  }

  protected _defaults(): Partial<HeatmapCardConfig> {
    return {
      time_range: '6h',
      heatmap_mode: 'histogram',
      counters: 'auto',
      color_scheme: 'oranges',
      log_scale: false,
      show_legend_scale: true,
      refresh_interval: 60
    };
  }

  /** Heatmap colours come from the colour scheme, no thresholds. */
  protected _hasThresholds(): boolean {
    return false;
  }

  private _options(prefix: string, values: string[]) {
    return values.map((value) => ({ value, label: localize(`${prefix}${value}`, this.hass) }));
  }

  protected _sections(): EditorSection[] {
    const series = this._config?.heatmap_mode === 'series';
    const q = querySection(
      { legend: series },
      TIME_RANGE_SCHEMA,
      { name: 'heatmap_mode', selector: { select: { mode: 'dropdown', options: this._options('heatmap_mode_', ['histogram', 'series']) } } },
      ...(series
        ? []
        : [{ name: 'counters', selector: { select: { mode: 'dropdown', options: this._options('counters_', ['auto', 'yes', 'no']) } } }])
    );
    return [
      panelSection(),
      q,
      displaySection(
        UNIT_SCHEMA,
        DECIMALS_SCHEMA,
        {
          name: 'color_scheme',
          selector: {
            select: {
              mode: 'dropdown',
              options: this._options('scheme_', ['oranges', 'spectral', 'viridis', 'blues', 'greens', 'reds', 'purples'])
            }
          }
        },
        { name: 'log_scale', selector: { boolean: {} } },
        ...(this._config?.card_height
          ? []
          : [{ name: 'height', selector: { number: { min: 60, max: 1000, mode: 'box', unit_of_measurement: 'px' } } }]),
        { name: 'show_legend_scale', selector: { boolean: {} } }
      )
    ];
  }
}
