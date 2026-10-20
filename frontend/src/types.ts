// HomeAssistant type (minimal interface for what we use)
export interface HomeAssistant {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  auth: { data: { access_token: string } };
  themes: { darkMode: boolean };
  language?: string;
  locale: { language: string; number_format: string };
  states: Record<string, HassEntity>;
  config: { unit_system: { temperature: string; length: string; mass: string; volume: string } };
  user?: { is_admin: boolean; name?: string };
}

// Schema for <ha-form> (subset used by the editors)
export interface HaFormSchema {
  name: string;
  type?: 'grid' | 'expandable';
  title?: string;
  icon?: string;
  flatten?: boolean;
  required?: boolean;
  default?: unknown;
  selector?: Record<string, unknown>;
  schema?: HaFormSchema[];
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

// Prometheus response types
export interface PrometheusResponse {
  status: 'success' | 'error';
  data: PrometheusData;
  errorType?: string;
  error?: string;
}

export interface PrometheusData {
  resultType: 'matrix' | 'vector' | 'scalar' | 'string';
  result: PrometheusResult[];
}

export interface PrometheusResult {
  metric: Record<string, string>;
  value?: [number, string];         // instant query
  values?: [number, string][];      // range query
}

// Card config types
export interface ThresholdConfig {
  value: number;
  color: string;
  /** no colour (e.g. hide the "normal" state on a state timeline) */
  transparent?: boolean;
}

/** @deprecated v0.6: one query per panel (`query` + `legend_format`); read for migration only */
export interface SeriesConfig {
  query: string;
  name?: string;
  color?: string;
  fill?: boolean;
}

export type PaletteOption = 'classic' | 'green-yellow-red' | 'blues' | 'greens' | 'reds' | 'purples' | 'single';

export interface PrometheusEntry {
  entry_id: string;
  name: string;
  url: string;
  loaded?: boolean;
  /** Alertmanager configured (backend v0.6+): the Alerts card offers "Silence" */
  alertmanager?: boolean;
}

export const INTEGRATION_DOMAIN = 'prometheus_dashboard';

// Base config shared by all cards
export interface BaseCardConfig {
  type: string;
  entry_id?: string;
  /** The one PromQL query of the panel */
  query?: string;
  /** Panel title (same look on every card) */
  title?: string;
  /** @deprecated v0.6: use `title` (still read) */
  name?: string;
  refresh_interval?: number;  // seconds, default 30
  unit?: string;              // Grafana unit id (see utils/units.ts) or custom suffix
  decimals?: number;          // empty = auto
  legend_format?: string;     // `{{label}}` template for series labels
  palette?: PaletteOption;    // colour scheme for multiple series
  transparent?: boolean;      // no card background / shadow
  /** Panel height in px; empty = auto (content height / height set by the Sections layout) */
  card_height?: number;
}

/** Value mapping (state timeline, stat): exact value or numeric range -> text + colour */
export interface ValueMapping {
  value?: string;
  from?: number;
  to?: number;
  text?: string;
  color?: string;
  transparent?: boolean;
}
