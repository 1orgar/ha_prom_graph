import { HomeAssistant, PrometheusResponse, PrometheusEntry } from './types';

export interface MetadataEntry {
  type: string;
  help: string;
  unit: string;
}

export class PrometheusClient {
  constructor(private hass: HomeAssistant, private entryId: string) {}

  async instantQuery(query: string, time?: number): Promise<PrometheusResponse> {
    return this.hass.callWS<PrometheusResponse>({
      type: 'prometheus_dashboard/query',
      entry_id: this.entryId,
      query,
      time
    });
  }

  async rangeQuery(query: string, start: number, end: number, step: string): Promise<PrometheusResponse> {
    return this.hass.callWS<PrometheusResponse>({
      type: 'prometheus_dashboard/query_range',
      entry_id: this.entryId,
      query,
      start,
      end,
      step
    });
  }

  async getLabels(): Promise<string[]> {
    const res = await this.hass.callWS<{status: string; data: string[]}>({
      type: 'prometheus_dashboard/labels',
      entry_id: this.entryId
    });
    return res.data;
  }

  async getLabelValues(label: string): Promise<string[]> {
    const res = await this.hass.callWS<{status: string; data: string[]}>({
      type: 'prometheus_dashboard/label_values',
      entry_id: this.entryId,
      label
    });
    return res.data;
  }

  async getMetadata(metric?: string): Promise<Record<string, MetadataEntry[]>> {
    const res = await this.hass.callWS<{status: string; data: Record<string, MetadataEntry[]>}>({
      type: 'prometheus_dashboard/metadata',
      entry_id: this.entryId,
      metric
    });
    return res.data;
  }

  async getSeries(matchers: string[]): Promise<Record<string, string>[]> {
    const res = await this.hass.callWS<{status: string; data: Record<string, string>[]}>({
      type: 'prometheus_dashboard/series',
      entry_id: this.entryId,
      matchers
    });
    return res.data;
  }

  static async getEntries(hass: HomeAssistant): Promise<PrometheusEntry[]> {
    return hass.callWS<PrometheusEntry[]>({
      type: 'prometheus_dashboard/entries'
    });
  }
}
