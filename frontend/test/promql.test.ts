import { describe, expect, it } from 'vitest';
import { applySuggestion, completionContext, rankSuggestions } from '../src/utils/promql';

const at = (s: string) => {
  const pos = s.indexOf('|');
  return { text: s.replace('|', ''), pos };
};

describe('completionContext', () => {
  it('metric name at the start', () => {
    const { text, pos } = at('node_lo|');
    expect(completionContext(text, pos)).toEqual({ kind: 'metric', prefix: 'node_lo', from: 0 });
  });

  it('metric inside a function', () => {
    const { text, pos } = at('rate(http_req|');
    expect(completionContext(text, pos)).toMatchObject({ kind: 'metric', prefix: 'http_req', from: 5 });
  });

  it('label name inside braces, with metric', () => {
    const { text, pos } = at('up{jo|');
    expect(completionContext(text, pos)).toMatchObject({ kind: 'label', prefix: 'jo', metric: 'up' });
  });

  it('label name after comma', () => {
    const { text, pos } = at('up{job="x", |');
    expect(completionContext(text, pos)).toMatchObject({ kind: 'label', prefix: '', metric: 'up' });
  });

  it('label name in by()', () => {
    const { text, pos } = at('sum by (inst|) (up)');
    expect(completionContext(text, pos)).toMatchObject({ kind: 'label', prefix: 'inst', metric: undefined });
  });

  it('label value', () => {
    const { text, pos } = at('up{job="no|');
    expect(completionContext(text, pos)).toMatchObject({ kind: 'label_value', label: 'job', prefix: 'no', metric: 'up' });
  });

  it('regex label value', () => {
    const { text, pos } = at('up{instance=~"a|');
    expect(completionContext(text, pos)).toMatchObject({ kind: 'label_value', label: 'instance', prefix: 'a' });
  });

  it('no completion in range duration', () => {
    const { text, pos } = at('rate(x[5|');
    expect(completionContext(text, pos).kind).toBe('none');
  });

  it('no completion after label operator (value expected)', () => {
    const { text, pos } = at('up{job=|');
    expect(completionContext(text, pos).kind).toBe('none');
  });
});

describe('rankSuggestions', () => {
  it('prefix first, then substring', () => {
    const list = ['node_load1', 'go_load', 'node_memory'].map((value) => ({ value, kind: 'metric' as const }));
    // no prefix match -> substring matches in original order
    expect(rankSuggestions('load', list).map((s) => s.value)).toEqual(['node_load1', 'go_load']);
    // prefix matches go before substring matches
    expect(rankSuggestions('go', [...list, { value: 'algo', kind: 'metric' }]).map((s) => s.value)).toEqual(['go_load', 'algo']);
    expect(rankSuggestions('node', list).map((s) => s.value)).toEqual(['node_load1', 'node_memory']);
  });
});

describe('applySuggestion', () => {
  it('replaces the current word with a metric', () => {
    const { text, pos } = at('rate(node_lo|[5m])');
    const ctx = completionContext(text, pos) as any;
    expect(applySuggestion(text, pos, ctx, { value: 'node_load1', kind: 'metric' }).text).toBe('rate(node_load1[5m])');
  });

  it('adds ( after a function', () => {
    const { text, pos } = at('ra|');
    const ctx = completionContext(text, pos) as any;
    const r = applySuggestion(text, pos, ctx, { value: 'rate', kind: 'function' });
    expect(r).toEqual({ text: 'rate(', cursor: 5 });
  });

  it('adds =" after a label in braces, but not in by()', () => {
    let { text, pos } = at('up{jo|}');
    let ctx = completionContext(text, pos) as any;
    expect(applySuggestion(text, pos, ctx, { value: 'job', kind: 'label' }).text).toBe('up{job="}');
    ({ text, pos } = at('sum by (jo|) (up)'));
    ctx = completionContext(text, pos) as any;
    expect(applySuggestion(text, pos, ctx, { value: 'job', kind: 'label' }).text).toBe('sum by (job) (up)');
  });

  it('closes the quote after a label value', () => {
    const { text, pos } = at('up{job="no|}');
    const ctx = completionContext(text, pos) as any;
    const r = applySuggestion(text, pos, ctx, { value: 'node', kind: 'value' });
    expect(r.text).toBe('up{job="node"}');
    expect(r.cursor).toBe('up{job="node"'.length);
  });
});
