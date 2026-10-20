import { HomeAssistant } from '../types';
import { PrometheusClient } from '../prometheus-client';
import { formatLegend } from '../utils/format';
import { localize } from '../localize';

export interface QueryTestResult {
  ok: boolean;
  text: string;
  samples?: string[];
}

/** Run a query once and summarise the result (series count, sample labels, errors). */
export async function testQuery(
  hass: HomeAssistant,
  entryId: string | undefined,
  query: string,
  mode: 'instant' | 'range'
): Promise<QueryTestResult> {
  const client = new PrometheusClient(hass, entryId);
  const started = performance.now();
  try {
    const now = Math.floor(Date.now() / 1000);
    const res =
      mode === 'range' ? await client.rangeQuery(query, now - 3600, now, '60s') : await client.instantQuery(query);
    const ms = Math.round(performance.now() - started);
    const data = res.data;
    if (data?.resultType === 'scalar') {
      const value = (data.result as unknown as [number, string])[1];
      return { ok: true, text: localize('test_ok', hass, { n: 1, ms, type: 'scalar' }), samples: [`scalar = ${value}`] };
    }
    const result = Array.isArray(data?.result) ? data.result : [];
    const samples = result.slice(0, 5).map((r) => {
      const v = r.value ? r.value[1] : r.values?.[r.values.length - 1]?.[1];
      return `${formatLegend(r.metric || {})} = ${v ?? '-'}`;
    });
    return {
      ok: true,
      text: localize('test_ok', hass, { n: result.length, ms, type: data?.resultType || '?' }),
      samples
    };
  } catch (e: any) {
    return { ok: false, text: e?.message || e?.code || String(e) };
  }
}
