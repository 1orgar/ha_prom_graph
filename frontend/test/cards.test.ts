import { describe, expect, it } from 'vitest';
import { filterAlerts, since } from '../src/cards/alerts-card/alerts-data';
import { barBackground } from '../src/cards/bar-gauge-card/bar-gauge-data';
import { mapValue } from '../src/utils/mappings';
import { buildSlices } from '../src/cards/pie-chart-card/pie-data';
import { vector } from './helpers';

describe('alerts', () => {
  const alerts = [
    { labels: { alertname: 'Info', severity: 'info' }, state: 'firing', activeAt: '2026-01-01T00:00:00Z' },
    { labels: { alertname: 'Crit', severity: 'critical' }, state: 'firing', activeAt: '2026-01-01T00:00:00Z' },
    { labels: { alertname: 'Soon' }, state: 'pending' },
    { labels: { alertname: 'Old' }, state: 'inactive' }
  ] as any;

  it('default: firing + pending, firing first, critical first', () => {
    expect(filterAlerts(alerts, {}).map((a) => a.labels.alertname)).toEqual(['Crit', 'Info', 'Soon']);
  });

  it('filters by severity and name (invalid regex -> substring)', () => {
    expect(filterAlerts(alerts, { severities: 'critical, warning' }).map((a) => a.labels.alertname)).toEqual(['Crit']);
    expect(filterAlerts(alerts, { name_filter: '^s' }).map((a) => a.labels.alertname)).toEqual(['Soon']);
    expect(filterAlerts(alerts, { name_filter: '[', states: ['inactive'] })).toEqual([]);
  });

  it('since', () => {
    expect(since('2026-01-01T00:00:00Z', Date.parse('2026-01-01T02:05:00Z'))).toBe('2h 5m');
    expect(since(undefined)).toBe('');
  });
});

describe('bar gauge / mappings / pie', () => {
  const thresholds = [{ value: 0, color: '#73BF69' }, { value: 80, color: '#F2495C' }];

  it('bar colours', () => {
    expect(barBackground('basic', 90, 0, 100, thresholds, '#000').fill).toBe('#F2495C');
    expect(barBackground('gradient', 90, 0, 100, thresholds, '#000').fill).toContain('linear-gradient');
    expect(barBackground('lcd', 50, 0, 100, thresholds, '#000').fill).toContain('transparent');
    expect(barBackground('gradient', 50, 0, 100, [], '#123456').fill).toBe('#123456');
  });

  it('value mappings: exact value, range, fallback', () => {
    const opts = { mappings: [{ value: '1', text: 'UP', color: 'green' }, { from: 2, to: 5, text: 'WARN' }] };
    expect(mapValue(1, opts, [0, 1])).toMatchObject({ text: 'UP', color: '#73BF69' });
    expect(mapValue(3, opts, [0, 1, 3])).toMatchObject({ text: 'WARN' });
    expect(mapValue(0, opts, [0, 1]).text).toBe('0');
  });

  it('pie: top N + Other, skips non-positive', () => {
    const res = vector([[{ job: 'a' }, 50], [{ job: 'b' }, 30], [{ job: 'c' }, 20], [{ job: 'd' }, -1]]);
    const slices = buildSlices(res, '{{job}}', { limit: 2, otherLabel: 'Other' });
    expect(slices.map((s) => [s.label, s.value, Math.round(s.percent)])).toEqual([
      ['a', 50, 50],
      ['b', 30, 30],
      ['Other', 20, 20]
    ]);
  });
});
