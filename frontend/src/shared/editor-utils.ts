import { css } from 'lit';
import { HaFormSchema, HomeAssistant, INTEGRATION_DOMAIN } from '../types';
import { unitSelectOptions } from '../utils/format';
import { localize } from '../localize';

export const editorStyles = css`
  .card-config {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .section-title {
    font-weight: 500;
    font-size: 15px;
    margin: 8px 0 -4px;
    color: var(--primary-text-color);
  }
  .helper {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
`;

export function fireEvent(
  node: HTMLElement,
  type: string,
  detail?: any,
  options?: { bubbles?: boolean; cancelable?: boolean; composed?: boolean }
) {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new CustomEvent(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
    detail
  });
  node.dispatchEvent(event);
  return event;
}

export function fireConfigChanged(element: HTMLElement, config: any) {
  fireEvent(element, 'config-changed', { config });
}

/**
 * HA lazy-loads <ha-form> and selectors. When a custom card editor is opened
 * they may not be registered yet, so we force-load them via a built-in card editor.
 */
let _haComponentsPromise: Promise<void> | undefined;
export function loadHaComponents(): Promise<void> {
  if (customElements.get('ha-form') && customElements.get('ha-selector')) {
    return Promise.resolve();
  }
  if (!_haComponentsPromise) {
    _haComponentsPromise = (async () => {
      try {
        const helpers = await (window as any).loadCardHelpers?.();
        if (!helpers) return;
        const card = await helpers.createCardElement({ type: 'entities', entities: [] });
        await (card?.constructor as any)?.getConfigElement?.();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('prometheus-cards: failed to preload HA form components', e);
      }
    })();
  }
  return _haComponentsPromise;
}

/** Remove keys with empty values so YAML stays clean. */
export function cleanConfig<T extends Record<string, any>>(config: T): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined || value === null || value === '') continue;
    if (typeof value === 'number' && Number.isNaN(value)) continue;
    result[key] = value;
  }
  return result as T;
}

// ---- Reusable schema pieces -------------------------------------------------

export const ENTRY_SCHEMA: HaFormSchema = {
  name: 'entry_id',
  selector: { config_entry: { integration: INTEGRATION_DOMAIN } }
};

export const QUERY_SCHEMA: HaFormSchema = {
  name: 'query',
  required: true,
  selector: { text: { multiline: true } }
};

export const REFRESH_SCHEMA: HaFormSchema = {
  name: 'refresh_interval',
  selector: { number: { min: 5, max: 86400, step: 1, mode: 'box', unit_of_measurement: 's' } }
};

export const TRANSPARENT_SCHEMA: HaFormSchema = {
  name: 'transparent',
  selector: { boolean: {} }
};

export const TITLE_SCHEMA: HaFormSchema = { name: 'title', selector: { text: {} } };

export const CARD_HEIGHT_SCHEMA: HaFormSchema = {
  name: 'card_height',
  selector: { number: { min: 60, max: 2000, step: 1, mode: 'box', unit_of_measurement: 'px' } }
};

export const TIME_RANGE_OPTIONS = ['15m', '30m', '1h', '3h', '6h', '12h', '24h', '2d', '7d', '30d'];

export const TIME_RANGE_SCHEMA: HaFormSchema = {
  name: 'time_range',
  selector: { select: { mode: 'dropdown', custom_value: true, options: TIME_RANGE_OPTIONS } }
};

export const STEP_SCHEMA: HaFormSchema = { name: 'step', selector: { text: {} } };

type Section = { title: string; schema: HaFormSchema[] };

/**
 * Block 1 "Panel": title, height, background - how the HA card itself looks.
 * `extra` = card specific panel fields (e.g. icon).
 */
export function panelSection(...extra: HaFormSchema[]): Section {
  return {
    title: 'section_panel',
    schema: [
      TITLE_SCHEMA,
      { name: '', type: 'grid', schema: [CARD_HEIGHT_SCHEMA, TRANSPARENT_SCHEMA, ...extra] }
    ]
  };
}

/**
 * Block 2 "Query": server, PromQL, legend format, refresh interval, time range...
 * `extra` = card specific query fields (time range, step, reduce...).
 */
export function querySection(opts: { legend?: boolean; query?: boolean } = {}, ...extra: HaFormSchema[]): Section {
  const grid: HaFormSchema[] = [...(opts.legend === false ? [] : [LEGEND_FORMAT_SCHEMA]), REFRESH_SCHEMA, ...extra];
  return {
    title: 'section_query',
    schema: [ENTRY_SCHEMA, ...(opts.query === false ? [] : [QUERY_SCHEMA]), { name: '', type: 'grid', schema: grid }]
  };
}

/** Block 3 "Display": everything about how the returned series are drawn. */
export function displaySection(...schema: HaFormSchema[]): Section {
  return { title: 'section_display', schema: [{ name: '', type: 'grid', schema }] };
}

export const DECIMALS_SCHEMA: HaFormSchema = {
  name: 'decimals',
  selector: { number: { min: 0, max: 6, step: 1, mode: 'box' } }
};

/** Grafana-like unit picker; `custom_value` keeps free-form suffixes possible. */
export const UNIT_SCHEMA: HaFormSchema = {
  name: 'unit',
  selector: { select: { mode: 'dropdown', custom_value: true, options: unitSelectOptions() } }
};

export const LEGEND_FORMAT_SCHEMA: HaFormSchema = {
  name: 'legend_format',
  selector: { text: {} }
};

export function paletteSchema(hass?: HomeAssistant): HaFormSchema {
  const options = ['classic', 'green-yellow-red', 'blues', 'greens', 'reds', 'purples', 'single'];
  return {
    name: 'palette',
    selector: {
      select: {
        mode: 'dropdown',
        options: options.map((value) => ({ value, label: localize(`palette_${value}`, hass) }))
      }
    }
  };
}

export function colorModeSchema(hass?: HomeAssistant): HaFormSchema {
  return {
    name: 'color_mode',
    selector: {
      select: {
        mode: 'dropdown',
        options: ['thresholds', 'series'].map((value) => ({ value, label: localize(`color_mode_${value}`, hass) }))
      }
    }
  };
}

