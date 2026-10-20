import { HomeAssistant } from '../types';
import { PrometheusClient } from '../prometheus-client';
import {
  CompletionContext,
  PROMQL_AGGREGATIONS,
  PROMQL_FUNCTIONS,
  PROMQL_KEYWORDS,
  rankSuggestions,
  Suggestion
} from '../utils/promql';

const TTL = 5 * 60 * 1000;
const cache = new Map<string, { at: number; value: Promise<unknown> }>();

/** Memoised websocket lookups (metric names, labels, values) per server. */
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as Promise<T>;
  const value = load().catch((e) => {
    cache.delete(key);
    throw e;
  });
  cache.set(key, { at: Date.now(), value });
  return value;
}

const STATIC: Suggestion[] = [
  ...PROMQL_AGGREGATIONS.map((value) => ({ value, kind: 'aggregation' as const })),
  ...PROMQL_FUNCTIONS.map((value) => ({ value, kind: 'function' as const })),
  ...PROMQL_KEYWORDS.map((value) => ({ value, kind: 'keyword' as const }))
];

async function metricNames(hass: HomeAssistant, entryId?: string): Promise<Suggestion[]> {
  const client = new PrometheusClient(hass, entryId);
  const [names, meta] = await Promise.all([
    cached(`${entryId}|names`, () => client.getLabelValues('__name__')),
    cached(`${entryId}|meta`, () => client.getMetadata().catch(() => ({}) as Record<string, { type: string; help: string }[]>))
  ]);
  return names.map((value) => {
    const m = (meta as Record<string, { type: string; help: string }[]>)[value]?.[0];
    return { value, kind: 'metric' as const, detail: m ? `${m.type} · ${m.help}` : undefined };
  });
}

async function labelNames(hass: HomeAssistant, entryId?: string, metric?: string): Promise<string[]> {
  const client = new PrometheusClient(hass, entryId);
  if (metric) {
    const series = await cached(`${entryId}|series|${metric}`, () => client.getSeries([metric]));
    const names = new Set<string>();
    for (const s of series.slice(0, 2000)) Object.keys(s).forEach((k) => k !== '__name__' && names.add(k));
    if (names.size) return [...names].sort();
  }
  return (await cached(`${entryId}|labels`, () => client.getLabels())).filter((l) => l !== '__name__');
}

async function labelValues(hass: HomeAssistant, entryId: string | undefined, label: string, metric?: string): Promise<string[]> {
  const client = new PrometheusClient(hass, entryId);
  if (metric) {
    const series = await cached(`${entryId}|series|${metric}`, () => client.getSeries([metric]));
    const values = new Set<string>();
    for (const s of series.slice(0, 5000)) if (s[label] !== undefined) values.add(s[label]);
    if (values.size) return [...values].sort();
  }
  return cached(`${entryId}|values|${label}`, () => client.getLabelValues(label));
}

/** Suggestions for a completion context (network errors -> static suggestions only). */
export async function suggest(
  hass: HomeAssistant,
  entryId: string | undefined,
  ctx: Exclude<CompletionContext, { kind: 'none' }>
): Promise<Suggestion[]> {
  try {
    if (ctx.kind === 'metric') {
      if (!ctx.prefix) return [];
      const metrics = await metricNames(hass, entryId).catch(() => []);
      return rankSuggestions(ctx.prefix, [...STATIC, ...metrics], 40);
    }
    if (ctx.kind === 'label') {
      const names = await labelNames(hass, entryId, ctx.metric);
      return rankSuggestions(ctx.prefix, names.map((value) => ({ value, kind: 'label' as const })), 40);
    }
    const values = await labelValues(hass, entryId, ctx.label, ctx.metric);
    return rankSuggestions(ctx.prefix, values.map((value) => ({ value, kind: 'value' as const })), 40);
  } catch {
    return ctx.kind === 'metric' ? rankSuggestions(ctx.prefix, STATIC, 40) : [];
  }
}
