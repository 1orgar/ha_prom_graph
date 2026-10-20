/**
 * Built-in demo data.
 *
 * Used when a card is rendered as a preview inside the dashboard card picker
 * (`hui-card-picker`) and by `demo/index.html` (README screenshots), so that the
 * previews look meaningful without depending on metrics of the real server.
 */
import type { PrometheusResponse } from '../types';

type Metric = Record<string, string>;
type Fn = (i: number, n: number) => number;
type Item = [Metric, number];

/** Deterministic pseudo random numbers (same picture on every render). */
function makeRnd(seed = 42) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const wave = (rnd: () => number, base: number, amp: number, period: number, noise: number): Fn => (i) =>
  base + amp * Math.sin((i / period) * Math.PI * 2) + (rnd() - 0.5) * noise;

const vector = (items: Item[], now: number): PrometheusResponse => ({
  status: 'success',
  data: { resultType: 'vector', result: items.map(([metric, v]) => ({ metric, value: [now, String(v)] })) }
});

function matrix(series: [Metric, Fn][], start: number, end: number, step: number): PrometheusResponse {
  const n = Math.max(2, Math.min(2000, Math.floor((end - start) / step)));
  return {
    status: 'success',
    data: {
      resultType: 'matrix',
      result: series.map(([metric, fn]) => ({
        metric,
        values: Array.from({ length: n + 1 }, (_, i) => [start + i * step, String(Math.max(0, fn(i, n)))] as [number, string])
      }))
    }
  };
}

interface Dataset {
  /** Current values (instant query) */
  instant: Item[];
  /** Series generators for range queries */
  range: (rnd: () => number) => [Metric, Fn][];
}

const by = (label: string, pairs: [string, number][]): Item[] => pairs.map(([v, n]) => [{ [label]: v }, n]);

/** Series oscillating around the instant values. */
const around = (items: Item[], amp: number, noise: number) => (rnd: () => number): [Metric, Fn][] =>
  items.map(([m, v], k) => [m, wave(rnd, v, amp * (v || 1), 25 + k * 7, noise * (v || 1))]);

const outage = (from: number, len: number, up = 1, down = 0): Fn => (i, n) =>
  i > n * from && i < n * (from + len) ? down : up;

const ds = (instant: Item[], amp = 0.1, noise = 0.08): Dataset => ({ instant, range: around(instant, amp, noise) });

const CPU = by('instance', [['nas', 23], ['router', 71], ['pi-kitchen', 12], ['hass', 94]]);
const DISK = by('mountpoint', [['/', 41], ['/boot', 18], ['/data', 86], ['/var/lib/docker', 63]]);
const MEM = by('instance', [['nas', 6.2e9], ['router', 3.1e8], ['pi-kitchen', 1.4e9], ['hass', 2.7e9]]);
const NET = by('device', [['eth0 rx', 4.2e6], ['eth0 tx', 1.1e6], ['wlan0 rx', 0.8e6]]);
const SCRAPE = by('job', [['node', 0.042], ['hass', 0.31], ['blackbox', 0.12], ['mqtt', 0.018]]);
const JOBS = by('job', [['node', 14], ['blackbox', 9], ['home-assistant', 6], ['mqtt', 3], ['prometheus', 2]]);
const UP: Item[] = [
  [{ job: 'node', instance: 'nas:9100' }, 1],
  [{ job: 'node', instance: 'router:9100' }, 1],
  [{ job: 'node', instance: 'pi-kitchen:9100' }, 0],
  [{ job: 'hass', instance: 'hass:8123' }, 1],
  [{ job: 'mqtt', instance: 'broker:9234' }, 1]
];
const LE = ['0.005', '0.01', '0.025', '0.05', '0.1', '0.25', '0.5', '1', '+Inf'];

/** Ordered rules: the first regexp matching the query wins. */
const RULES: [RegExp, Dataset][] = [
  [/bucket/, {
    instant: [],
    range: (rnd) =>
      LE.map((le, k) => [{ le }, (i) => (k + 1) * 8 + Math.pow(k, 1.6) * (6 + 5 * Math.sin(i / 9)) + rnd() * 6])
  }],
  [/network|receive|transmit/, {
    instant: NET,
    range: (rnd) => [
      [NET[0][0], wave(rnd, 4.2e6, 2.5e6, 40, 1.2e6)],
      [NET[1][0], wave(rnd, 1.1e6, 0.6e6, 55, 0.5e6)],
      [NET[2][0], wave(rnd, 0.8e6, 0.4e6, 30, 0.3e6)]
    ]
  }],
  [/cpu/, ds(CPU, 0.3, 0.25)],
  [/filesystem|disk/, ds(DISK, 0.02, 0.01)],
  [/memory/, ds(MEM, 0.08, 0.04)],
  [/temp/, ds([[{ sensor: 'living room' }, 22.4]], 0.03, 0.01)],
  [/power|watt/, ds([[{ device: 'house' }, 1843]], 0.25, 0.1)],
  [/scrape_duration/, ds(SCRAPE, 0.3, 0.3)],
  [/count by \(job\)/, ds(JOBS, 0, 0)],
  [/avg\s*\(\s*up\s*\)/, { instant: [[{}, 80]], range: () => [[{}, outage(0.6, 0.1, 100, 80)]] }],
  [/count\s*\(\s*up\s*\)/, ds([[{}, 5]], 0, 0)],
  [/sum\s*\(\s*up\s*\)/, { instant: [[{}, 4]], range: () => [[{}, outage(0.6, 0.1, 5, 4)]] }],
  [/\bup\b/, {
    instant: UP,
    range: () => [
      [{ job: 'nas' }, outage(0.62, 0.08)],
      [{ job: 'router' }, () => 1],
      [{ job: 'pi-kitchen' }, outage(0.2, 0.35)],
      [{ job: 'mqtt' }, outage(0.85, 0.04)]
    ]
  }]
];

const DEFAULT = ds([[{ job: 'demo' }, 42]], 0.4, 0.2);

const pick = (query: string): Dataset => RULES.find(([re]) => re.test(query))?.[1] ?? DEFAULT;

function alerts() {
  const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
  return [
    { labels: { alertname: 'HostHighCpuLoad', severity: 'critical', instance: 'hass' }, state: 'firing',
      activeAt: ago(47 * 60e3), annotations: { summary: 'CPU load is above 90% for 10 minutes' } },
    { labels: { alertname: 'DiskAlmostFull', severity: 'warning', mountpoint: '/data' }, state: 'firing',
      activeAt: ago(5.2 * 3600e3), annotations: { summary: '/data is 86% full' } },
    { labels: { alertname: 'TargetDown', severity: 'warning', instance: 'pi-kitchen:9100' }, state: 'pending',
      activeAt: ago(3 * 60e3), annotations: { summary: 'pi-kitchen is not reachable' } }
  ];
}

/** Answer a `prometheus_dashboard/*` websocket message with demo data. */
export async function demoCallWS<T = any>(msg: Record<string, any>): Promise<T> {
  const kind = String(msg.type).split('/')[1];
  const now = Math.floor(Date.now() / 1000);
  let res: unknown;
  switch (kind) {
    case 'query':
      res = vector(pick(String(msg.query)).instant, now);
      break;
    case 'query_range':
      res = matrix(pick(String(msg.query)).range(makeRnd()), Number(msg.start), Number(msg.end), parseFloat(msg.step) || 60);
      break;
    case 'alerts':
      res = { alerts: alerts() };
      break;
    case 'entries':
      res = [{ entry_id: 'demo', title: 'Demo', url: 'http://prometheus:9090', loaded: true }];
      break;
    default:
      res = { status: 'success', data: [] };
  }
  return res as T;
}

/** Element names of the "Add card" dialog in which cards render with demo data. */
const PICKER_HOSTS = new Set(['hui-card-picker']);

/**
 * True when the element is rendered as a preview in the dashboard "Add card" picker
 * (or when the page forces demo mode via `window.__PROM_CARDS_DEMO__`).
 */
export function isDemoContext(el: Element): boolean {
  if ((globalThis as any).__PROM_CARDS_DEMO__) return true;
  // Walk up through shadow roots: element -> parentNode ... -> ShadowRoot.host -> ...
  let node: any = el;
  while (node) {
    if (node.localName && PICKER_HOSTS.has(node.localName)) return true;
    node = node.parentNode || node.host || null;
  }
  return false;
}

