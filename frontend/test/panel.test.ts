import { describe, expect, it } from 'vitest';
import { migrateConfig, rowsForHeight } from '../src/utils/migrate';
import { buildChartData, niceStep, yRange, yTicks } from '../src/cards/timeseries-card/timeseries-data';
import { barPercent, buildBars, gradientFill } from '../src/cards/bar-chart-card/bar-data';
import { getThresholdColor } from '../src/utils/color';
import { mapValue } from '../src/utils/mappings';
import { activeFor, durationSeconds, filterAlerts, groupAlerts } from '../src/cards/alerts-card/alerts-data';
import { labelWidth } from '../src/cards/heatmap-card/heatmap-draw';
import { matrix, vector } from './helpers';

describe('config migration (one query per panel, title)', () => {
  it('series[0] -> query + legend_format, name -> title', () => {
    const c = migrateConfig({
      type: 'custom:prometheus-timeseries-card',
      name: 'CPU',
      series: [{ query: 'rate(x[5m])', name: '{{instance}}', fill: true }, { query: 'y' }]
    } as any);
    expect(c).toMatchObject({ title: 'CPU', query: 'rate(x[5m])', legend_format: '{{instance}}', fill: true });
    expect(c).not.toHaveProperty('series');
    expect(c).not.toHaveProperty('name');
  });

  it('keeps an existing query / title', () => {
    const c = migrateConfig({ type: 't', query: 'a', title: 'T', name: 'N', series: [{ query: 'b' }] } as any);
    expect(c).toMatchObject({ query: 'a', title: 'T' });
  });

  it('panel height -> sections rows', () => {
    expect(rowsForHeight(56)).toBe(1);
    expect(rowsForHeight(120)).toBe(2);
    expect(rowsForHeight(300)).toBe(5);
  });
});

describe('time series', () => {
  it('one query -> one line per series with palette colours (no per-query colour)', () => {
    const d = buildChartData(matrix([[{ job: 'a' }, [1, 2]], [{ job: 'b' }, [3, 4]]]), '{{job}}', 'classic');
    expect(d.series.map((s) => s.label)).toEqual(['a', 'b']);
    expect(d.series[0].color).not.toBe(d.series[1].color);
    expect(d.series[1].stats).toMatchObject({ min: 3, max: 4, last: 4 });
  });

  it('y axis without min starts at a labelled origin', () => {
    expect(niceStep(100, 5)).toBe(20);
    // non-negative data near zero -> starts at 0
    expect(yRange(0.042, 0.31, {})).toEqual([0, 0.4]);
    // data far from zero -> nice value below the minimum, not the raw minimum
    const [lo, hi] = yRange(203.7, 251.2, {});
    expect(lo).toBe(200);
    expect(hi).toBe(260);
    expect(yTicks(lo, hi)[0]).toBe(lo);
    // explicit min / max are kept
    expect(yRange(5, 7, { min: 1, max: 9 })).toEqual([1, 9]);
    // negative data
    expect(yRange(-3.3, 4, {})[0]).toBe(-4);
    // constant series
    expect(yRange(5, 5, {})[0]).toBeLessThan(5);
  });

  it('IEC units: steps are nice in KiB / MiB', () => {
    const MiB = 1024 * 1024;
    const [lo, hi] = yRange(0, 6.83 * MiB, { base: 1024 });
    expect(lo).toBe(0);
    expect(hi % MiB).toBe(0);
    expect(yTicks(lo, hi, 5, 1024).every((t) => t % MiB === 0)).toBe(true);
  });

  it('ticks: first tick is the origin even when it is not a multiple of the step', () => {
    const t = yTicks(3, 10, 5);
    expect(t[0]).toBe(3);
    expect(t).toContain(10);
  });
});

describe('bar chart', () => {
  const c: any = { type: 'custom:prometheus-bar-card', legend_format: '{{job}}' };

  it('sort desc, limit, max', () => {
    const { bars, max } = buildBars(vector([[{ job: 'a' }, 1], [{ job: 'b' }, 5], [{ job: 'c' }, 3]]), { ...c, limit: 2 });
    expect(bars.map((b) => b.label)).toEqual(['b', 'c']);
    expect(max).toBe(5);
    expect(barPercent(2.5, 5)).toBe(50);
    expect(barPercent(10, 5)).toBe(100);
  });

  it('gradient by thresholds is laid out on the whole scale', () => {
    const th = [{ value: 0, color: 'green' }, { value: 50, color: '#FF9830' }, { value: 80, color: 'red' }];
    // bar filled to 50% of the track: gradient stretched to 200% of the fill
    const g = gradientFill(th, 100, 50, false)!;
    expect(g).toBe('linear-gradient(90deg, #73BF69 0%, #FF9830 50.00%, #F2495C 80.00%) left top / 200.00% 100% no-repeat');
    expect(gradientFill(th, 100, 25, true)).toContain('linear-gradient(0deg');
    expect(gradientFill(th, 100, 25, true)).toContain('100% 400.00%');
    // nothing to blend
    expect(gradientFill([{ value: 0, color: 'green' }], 100, 50, false)).toBeNull();
    expect(gradientFill(th, 100, 0, false)).toBeNull();
  });
});

describe('transparent thresholds / mappings', () => {
  it('threshold colour can be transparent', () => {
    const th = [{ value: 0, color: '#73BF69', transparent: true }, { value: 1, color: '#F2495C' }];
    expect(getThresholdColor(0, th)).toBe('transparent');
    expect(getThresholdColor(1, th)).toBe('#F2495C');
  });

  it('mapping colour can be transparent', () => {
    const s = mapValue(1, { mappings: [{ value: '1', text: 'UP', color: 'green', transparent: true }] }, [1]);
    expect(s).toMatchObject({ text: 'UP', color: 'transparent' });
  });
});

describe('alerts: firing window, source, all series', () => {
  const now = Date.parse('2026-01-01T01:00:00Z');
  const alerts = [
    { labels: { alertname: 'Disk', instance: 'a' }, state: 'firing', activeAt: '2026-01-01T00:00:00Z' },
    { labels: { alertname: 'Disk', instance: 'b' }, state: 'firing', activeAt: '2026-01-01T00:58:00Z' },
    { labels: { alertname: 'Cpu' }, state: 'firing', activeAt: '2026-01-01T00:30:00Z', source: 'home_assistant' }
  ] as any;

  it('durations', () => {
    expect(durationSeconds('5m')).toBe(300);
    expect(durationSeconds('1h30m')).toBe(5400);
    expect(durationSeconds('90')).toBe(90);
    expect(durationSeconds('bad')).toBe(0);
    expect(activeFor(alerts[0], now)).toBe(3600);
  });

  it('min_active hides recently started alerts; every series is kept', () => {
    expect(filterAlerts(alerts, {}, now)).toHaveLength(3);
    // Disk/b is active only 2 minutes; newest first
    expect(filterAlerts(alerts, { min_active: '5m' }, now).map((a) => a.labels.instance ?? a.labels.alertname)).toEqual([
      'Cpu',
      'a'
    ]);
  });

  it('source filter and grouping', () => {
    expect(filterAlerts(alerts, { source: 'local' }, now).map((a) => a.labels.alertname)).toEqual(['Cpu']);
    expect(filterAlerts(alerts, { source: 'prometheus' }, now)).toHaveLength(2);
    expect(groupAlerts(filterAlerts(alerts, {}, now)).map((g) => [g.alert.labels.alertname, g.count])).toEqual([
      ['Disk', 2],
      ['Cpu', 1]
    ]);
  });
});

describe('heatmap axis', () => {
  it('label column follows the longest le value', () => {
    expect(labelWidth(['0.1', '+Inf'])).toBeLessThan(labelWidth(['{instance="very-long-host-name:9100"}']));
    expect(labelWidth(['x'.repeat(200)])).toBe(110);
  });
});
