import { BaseCardConfig, ThresholdConfig } from '../../types';

export interface BarChartCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-bar-card';
  group_by?: string;        // label to group bars by
  orientation?: 'horizontal' | 'vertical';  // default 'horizontal'
  unit?: string;
  decimals?: number;
  max?: number;             // max value for bar scale
  thresholds?: ThresholdConfig[];
  show_values?: boolean;    // show value labels, default true
  bar_height?: number;      // height of each bar in px for horizontal, default 24
}
