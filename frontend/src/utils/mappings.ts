import { ThresholdConfig, ValueMapping, PaletteOption } from '../types';
import { formatValue } from './format';
import { getThresholdColor, stepColor } from './color';
import { itemColor } from './series';

export interface MappedState {
  key: string;     // identity of the state (for merging / legend)
  text: string;
  color: string;
}

function matches(m: ValueMapping, value: number): boolean {
  if (m.value !== undefined && m.value !== null && String(m.value) !== '') {
    const n = Number(m.value);
    return Number.isFinite(n) ? n === value : String(m.value) === String(value);
  }
  const hasFrom = m.from !== undefined && m.from !== null;
  const hasTo = m.to !== undefined && m.to !== null;
  if (!hasFrom && !hasTo) return false;
  return (!hasFrom || value >= m.from!) && (!hasTo || value <= m.to!);
}

/**
 * Value -> state. Order: value mappings, thresholds, then a stable palette
 * colour per distinct value (so e.g. 0/1/2 states get distinct colours).
 */
export function mapValue(
  value: number,
  opts: { mappings?: ValueMapping[]; thresholds?: ThresholdConfig[]; unit?: string; decimals?: number; palette?: PaletteOption },
  distinct: number[]
): MappedState {
  const text = formatValue(value, opts.decimals, opts.unit);
  for (const [i, m] of (opts.mappings || []).entries()) {
    if (matches(m, value)) {
      return {
        key: `m${i}`,
        text: m.text || text,
        color: stepColor(m) || itemColor(i, (opts.mappings || []).length, opts.palette)
      };
    }
  }
  if (opts.thresholds?.length) {
    const color = getThresholdColor(value, opts.thresholds);
    return { key: `t${color}`, text, color };
  }
  const idx = Math.max(0, distinct.indexOf(value));
  return { key: `v${value}`, text, color: itemColor(idx, Math.max(distinct.length, 2), opts.palette) };
}
