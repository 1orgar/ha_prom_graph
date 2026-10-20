import type { PrometheusResponse } from '../src/types';

export const vector = (items: [Record<string, string>, number][]): PrometheusResponse => ({
  status: 'success',
  data: { resultType: 'vector', result: items.map(([metric, v]) => ({ metric, value: [0, String(v)] })) }
});

export const matrix = (items: [Record<string, string>, number[]][]): PrometheusResponse => ({
  status: 'success',
  data: {
    resultType: 'matrix',
    result: items.map(([metric, vals]) => ({
      metric,
      values: vals.map((v, i) => [1000 + i * 60, String(v)] as [number, string])
    }))
  }
});
