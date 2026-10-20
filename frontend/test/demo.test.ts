import { describe, it, expect, afterEach } from 'vitest';
import { demoCallWS, isDemoContext } from '../src/demo/demo-data';
import { PrometheusClient } from '../src/prometheus-client';

describe('demo data', () => {
  it('returns an instant vector matching the query', async () => {
    const res: any = await demoCallWS({ type: 'prometheus_dashboard/query', query: 'node_filesystem_usage' });
    expect(res.status).toBe('success');
    expect(res.data.resultType).toBe('vector');
    expect(res.data.result.map((r: any) => r.metric.mountpoint)).toContain('/data');
  });

  it('returns a range matrix covering the requested window', async () => {
    const res: any = await demoCallWS({
      type: 'prometheus_dashboard/query_range', query: 'up', start: 1000, end: 4600, step: '60s'
    });
    expect(res.data.resultType).toBe('matrix');
    const values = res.data.result[0].values;
    expect(values[0][0]).toBe(1000);
    expect(values).toHaveLength(61);
  });

  it('is deterministic', async () => {
    const msg = { type: 'prometheus_dashboard/query_range', query: 'cpu', start: 0, end: 3600, step: '60' };
    expect(await demoCallWS(msg)).toEqual(await demoCallWS(msg));
  });

  it('returns alerts', async () => {
    const res: any = await demoCallWS({ type: 'prometheus_dashboard/alerts' });
    expect(res.alerts.length).toBeGreaterThan(0);
  });

  it('client in demo mode does not call the backend', async () => {
    const hass: any = { callWS: () => { throw new Error('backend called'); } };
    const client = new PrometheusClient(hass, undefined, true);
    const res = await client.instantQuery('sum(up)');
    expect(res.data.result[0].value[1]).toBe('4');
  });
});

describe('isDemoContext', () => {
  // Minimal DOM stand-ins: element.parentNode / shadowRoot.host
  const el = (localName: string, parentNode: any = null) => ({ localName, parentNode });
  const shadow = (host: any) => ({ parentNode: null, host });

  afterEach(() => {
    delete (globalThis as any).__PROM_CARDS_DEMO__;
  });

  it('detects the card picker through shadow roots', () => {
    const body = el('body');
    const picker = el('hui-card-picker', body);
    const card = el('prometheus-stat-card', shadow(el('div', shadow(picker))));
    expect(isDemoContext(card as any)).toBe(true);
  });

  it('is false on a normal dashboard', () => {
    const view = el('hui-sections-view', el('body'));
    const card = el('prometheus-stat-card', shadow(view));
    expect(isDemoContext(card as any)).toBe(false);
  });

  it('can be forced by the page', () => {
    (globalThis as any).__PROM_CARDS_DEMO__ = true;
    expect(isDemoContext(el('div') as any)).toBe(true);
  });
});
