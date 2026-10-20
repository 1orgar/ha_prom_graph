import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ALL_VALUE,
  dashboardVariables,
  expandVariables,
  setVariableOptions,
  setVariables,
  usesVariables,
  variableNames,
  VARIABLES_EVENT
} from '../src/utils/variables';
import { guessLabel, labelValues, resolveValue } from '../src/cards/variables-card/variables-data';
import { alertDraft, canCreateAlerts } from '../src/shared/create-alert';
import { PrometheusClient } from '../src/prometheus-client';
import { vector } from './helpers';

describe('variable substitution', () => {
  it('$var and ${var}; unknown variables stay', () => {
    const q = 'rate(x{instance="$instance"}[$__rate_interval]) / ${job}_total';
    expect(expandVariables(q, { instance: 'nas:9100', job: 'node' })).toBe(
      'rate(x{instance="nas:9100"}[$__rate_interval]) / node_total'
    );
  });

  it('several values become a regex alternation, escaped in =~ matchers', () => {
    expect(expandVariables('up{instance=~"$i"}', { i: ['a.b:1', 'c'] })).toBe('up{instance=~"a\\.b:1|c"}');
    expect(expandVariables('up{instance=~"$i"}', { i: 'a.b' })).toBe('up{instance=~"a\\.b"}');
    // outside a regex matcher one value is inserted as is
    expect(expandVariables('up{instance="$i"}', { i: 'a.b' })).toBe('up{instance="a.b"}');
    expect(expandVariables('up{instance=~"$i"}', { i: [] })).toBe('up{instance=~".*"}');
  });

  it('longest name wins ($inst does not eat $instance)', () => {
    expect(expandVariables('$instance $inst', { inst: 'x', instance: 'y' })).toBe('y x');
  });

  it('names used in a query', () => {
    expect(variableNames('a{b="$x", c=~"${y}"} $x')).toEqual(['x', 'y']);
    expect(usesVariables('up{job="$job"}', ['job'])).toBe(true);
    expect(usesVariables('up{job="$job"}', ['instance'])).toBe(false);
    expect(usesVariables('up', ['job'])).toBe(false);
  });
});

describe('variables store', () => {
  const g = globalThis as any;
  let events: { type: string; names: string[] }[] = [];
  let saved: Record<string, string> = {};

  beforeEach(() => {
    g.__PROM_CARDS_VARS__ = undefined;
    events = [];
    saved = {};
    // minimal browser window (tests run in node)
    g.window = {
      dispatchEvent: (e: CustomEvent) => events.push({ type: e.type, names: e.detail.names }),
      localStorage: { getItem: (k: string) => saved[k] ?? null, setItem: (k: string, v: string) => (saved[k] = v) }
    };
  });

  afterEach(() => {
    delete g.window;
  });

  it('change event only with changed names, $__all = every known value', () => {
    setVariableOptions('instance', ['a', 'b']);
    setVariables({ instance: [ALL_VALUE], job: 'node' });
    setVariables({ instance: [ALL_VALUE], job: 'node' });
    setVariables({ job: 'hass' });
    expect(events).toEqual([
      { type: VARIABLES_EVENT, names: ['instance', 'job'] },
      { type: VARIABLES_EVENT, names: ['job'] }
    ]);
    // remembered for the next page load
    expect(JSON.parse(saved['prometheus-cards-variables'])).toEqual({ instance: [ALL_VALUE], job: 'hass' });
    expect(dashboardVariables()).toEqual({ instance: ['a', 'b'], job: 'hass' });
    // next page load: values restored; "All" before the variables card loaded the options = match all
    g.__PROM_CARDS_VARS__ = undefined;
    expect(expandVariables('up{instance=~"$instance",job="$job"}', dashboardVariables())).toBe(
      'up{instance=~".*",job="hass"}'
    );
  });

  it('the client substitutes variables before querying', async () => {
    setVariables({ job: 'node' });
    const sent: any[] = [];
    const hass = { callWS: async (msg: any) => (sent.push(msg), vector([])) } as any;
    await new PrometheusClient(hass).instantQuery('up{job="$job"}');
    await new PrometheusClient(hass, undefined, false, false).instantQuery('up{job="$job"}');
    expect(sent.map((m) => m.query)).toEqual(['up{job="node"}', 'up{job="$job"}']);
  });
});

describe('variables card data', () => {
  const res = vector([
    [{ job: 'node', instance: 'nas:9100' }, 1],
    [{ job: 'node', instance: 'pi-10:9100' }, 1],
    [{ job: 'node', instance: 'pi-9:9100' }, 0],
    [{ job: 'hass', instance: 'hass:8123' }, 1]
  ]);

  it('distinct values, natural order, regex capture', () => {
    expect(labelValues(res, 'job')).toEqual(['hass', 'node']);
    expect(labelValues(res, 'instance', '^(pi-\\d+)')).toEqual(['pi-9', 'pi-10']);
    expect(labelValues(res, 'instance', '(')).toHaveLength(4); // invalid regex: ignored
  });

  it('label: configured, the only label, or the variable name', () => {
    expect(guessLabel(res, { name: 'x', label_name: 'job' })).toBe('job');
    expect(guessLabel(vector([[{ job: 'a' }, 1]]), { name: 'x' })).toBe('job');
    expect(guessLabel(res, { name: 'instance' })).toBe('instance');
    expect(guessLabel(res, { name: 'x' })).toBeUndefined();
  });

  it('keeps a valid value, else default / All / first', () => {
    expect(resolveValue({ name: 'j' }, ['a', 'b'], 'b')).toBe('b');
    expect(resolveValue({ name: 'j' }, ['a', 'b'], 'gone')).toBe('a');
    expect(resolveValue({ name: 'j', default: 'b' }, ['a', 'b'], undefined)).toBe('b');
    expect(resolveValue({ name: 'j', include_all: true, multi: true }, ['a'], undefined)).toEqual([ALL_VALUE]);
    expect(resolveValue({ name: 'j', multi: true }, ['a', 'b'], ['b', 'gone'])).toEqual(['b']);
    expect(resolveValue({ name: 'j' }, [], undefined)).toBe('');
  });
});

describe('create alert from a card', () => {
  it('title and the first threshold above the base', () => {
    const t = [{ value: 90, color: 'red' }, { value: 0, color: 'green' }, { value: 70, color: 'orange' }];
    expect(alertDraft({ title: 'CPU', thresholds: t })).toEqual({
      name: 'CPU',
      condition: 'gt',
      threshold: 70,
      for: '5m',
      severity: 'warning'
    });
    expect(alertDraft({ title: 'Up' })).toMatchObject({ condition: 'any', threshold: undefined });
    expect(alertDraft({ thresholds: [{ value: 5, color: 'red' }] })).toMatchObject({ threshold: 5, condition: 'gt' });
  });

  it('admins only (unknown user: allowed, the backend checks)', () => {
    expect(canCreateAlerts({ user: { is_admin: false } } as any)).toBe(false);
    expect(canCreateAlerts({ user: { is_admin: true } } as any)).toBe(true);
    expect(canCreateAlerts({} as any)).toBe(true);
  });
});
