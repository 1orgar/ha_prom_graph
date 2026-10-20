import { describe, expect, it } from 'vitest';
import { formatLegend, formatValue, shortLabel } from '../src/utils/format';
import { getThresholdColor, paletteColor, GRAFANA_CLASSIC, withAlpha } from '../src/utils/color';

describe('formatValue (Grafana units)', () => {
  it.each([
    [1536, 'bytes', '1.5 KiB'],
    [8589934592, 'bytes', '8 GiB'],
    [1500000, 'decbytes', '1.5 MB'],
    [12500000, 'bps', '12.5 Mb/s'],
    [2048, 'kbytes', '2 MiB'],
    [0.25, 's', '250 ms'],
    [95, 's', '1.58 min'],
    [1500, 'ms', '1.5 s'],
    [93784, 'dtdurations', '1d 2h 3m'],
    [1234, 'watt', '1.23 kW'],
    [0.0021, 'amp', '2.1 mA'],
    [0.873, 'percentunit', '87.3%'],
    [55.555, 'percent', '55.6%'],
    [23.4, 'celsius', '23.4°C'],
    [1500, 'currencyUSD', '$1.5K'],
    [1, 'bool_on_off', 'On'],
    [0, 'bytes', '0 B']
  ])('%s %s -> %s', (v, unit, expected) => {
    expect(formatValue(v, undefined, unit)).toBe(expected);
  });

  it('decimals and custom suffix', () => {
    expect(formatValue(1536, 2, 'bytes')).toBe('1.50 KiB');
    expect(formatValue(42, undefined, 'rpm')).toBe('42 rpm');
    expect(formatValue(null, 2, 'bytes')).toBe('-');
  });

  it('legacy aliases', () => {
    expect(formatValue(50, 0, '%')).toBe('50%');
    expect(formatValue(2048, undefined, 'B')).toBe('2 KiB');
  });
});

describe('legend', () => {
  it('Grafana default and template', () => {
    expect(formatLegend({ __name__: 'up', job: 'node' })).toBe('up{job="node"}');
    expect(formatLegend({ job: 'node', instance: 'a' }, '{{job}} @ {{ instance }}')).toBe('node @ a');
    expect(formatLegend({ job: 'node' }, '{{missing}}x')).toBe('x');
  });

  it('short label', () => {
    expect(shortLabel({ __name__: 'x', mountpoint: '/' })).toBe('/');
    expect(shortLabel({ __name__: 'x' })).toBe('x');
    expect(shortLabel({}, '{{a}}')).toBe('');
  });
});

describe('colors', () => {
  it('thresholds pick the highest threshold <= value', () => {
    const t = [{ value: 0, color: 'green' }, { value: 80, color: '#F2495C' }];
    expect(getThresholdColor(10, t)).toBe('#73BF69'); // named colour resolved
    expect(getThresholdColor(95, t)).toBe('#F2495C');
    expect(getThresholdColor(-5, t)).toBe('#73BF69');
  });

  it('palette', () => {
    expect(paletteColor(0, 3)).toBe(GRAFANA_CLASSIC[0]);
    expect(paletteColor(GRAFANA_CLASSIC.length, 100)).toBe(GRAFANA_CLASSIC[0]);
    expect(paletteColor(0, 5, 'green-yellow-red')).toBe('#73BF69');
    expect(paletteColor(4, 5, 'green-yellow-red')).toBe('#F2495C');
    expect(withAlpha('#112233', 0.5)).toBe('#11223380');
    expect(withAlpha('red', 0.5)).toBe('red');
  });
});
