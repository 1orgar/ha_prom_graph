// HomeAssistant type (minimal interface for what we use)
export interface HomeAssistant {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  auth: { data: { access_token: string } };
  themes: { darkMode: boolean };
  locale: { language: string; number_format: string };
  states: Record<string, HassEntity>;
  config: { unit_system: { temperature: string; length: string; mass: string; volume: string } };
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
}

export interface SeriesConfig {
  query: string;
  name?: string;
  color?: string;
  fill?: boolean;
}

export interface PrometheusEntry {
  entry_id: string;
  name: string;
  url: string;
}

// Base config shared by all cards
export interface BaseCardConfig {
  type: string;
  entry_id?: string;
  query?: string;
  name?: string;
  refresh_interval?: number;  // seconds, default 30
}
