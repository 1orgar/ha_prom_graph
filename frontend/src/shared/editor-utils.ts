import { css } from 'lit';
import { HomeAssistant, PrometheusEntry } from '../types';
import { PrometheusClient } from '../prometheus-client';

export const editorStyles = css`
  .card-config {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .card-config ha-textfield,
  .card-config ha-select {
    width: 100%;
  }
  .field-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export function fireEvent(node: HTMLElement, type: string, detail?: any, options?: { bubbles?: boolean, cancelable?: boolean, composed?: boolean }) {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new CustomEvent(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
    detail,
  });
  node.dispatchEvent(event);
  return event;
}

export function fireConfigChanged(element: HTMLElement, config: any) {
  fireEvent(element, 'config-changed', { config });
}

// Alias for backward compatibility
export const configChanged = fireConfigChanged;

export async function loadPrometheusEntries(hass: HomeAssistant): Promise<PrometheusEntry[]> {
  try {
    return await PrometheusClient.getEntries(hass);
  } catch (e) {
    console.error("Failed to load Prometheus entries", e);
    return [];
  }
}
