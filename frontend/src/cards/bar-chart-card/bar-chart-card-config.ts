import { BaseCardConfig, ThresholdConfig } from '../../types';

export interface BarChartCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-bar-card';
  orientation?: 'horizontal' | 'vertical';  // default 'horizontal'
  max?: number;             // max value for bar scale
  thresholds?: ThresholdConfig[];
  color_mode?: 'thresholds' | 'series';
  sort?: 'desc' | 'asc' | 'name' | 'none';
  limit?: number;           // show at most N bars
  show_values?: boolean;    // show value labels, default true
  /** px; empty = auto (bars share the panel height, 24px when the panel height is auto) */
  bar_height?: number;
  /** transparent background of the unfilled part of every bar, default false */
  transparent_track?: boolean;
  /** with a transparent track: value right after the end of the bar instead of a column */
  value_at_end?: boolean;
  /** colour mode `thresholds`: threshold colours blended along the bar (like a bar gauge), default false */
  gradient?: boolean;
}
