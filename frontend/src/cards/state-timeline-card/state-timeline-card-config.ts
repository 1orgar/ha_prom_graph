import { BaseCardConfig, ThresholdConfig, ValueMapping } from '../../types';

export interface StateTimelineCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-state-timeline-card';
  /** one query per panel; every returned series becomes one row */
  query?: string;
  time_range?: string;        // default '6h'
  step?: string;
  /** Exact value (`value`) or range (`from`..`to`) -> display text + colour */
  mappings?: ValueMapping[];
  thresholds?: ThresholdConfig[];
  row_height?: number;        // px; empty = auto (rows share a fixed panel height, 26px otherwise)
  show_values?: boolean;      // text inside segments, default true
  show_legend?: boolean;      // legend of states, default true
  merge_values?: boolean;     // merge equal neighbours, default true
}
