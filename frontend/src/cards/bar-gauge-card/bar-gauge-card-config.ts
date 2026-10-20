import { BaseCardConfig, ThresholdConfig } from '../../types';

export interface BarGaugeCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-bar-gauge-card';
  min?: number;                     // default 0
  max?: number;                     // default: max of values (or 100)
  thresholds?: ThresholdConfig[];
  display_mode?: 'gradient' | 'basic' | 'lcd';
  show_unfilled?: boolean;          // default true
  orientation?: 'horizontal' | 'vertical';
  bar_height?: number;              // px, horizontal; empty = auto (share a fixed panel height, 18px otherwise)
  sort?: 'desc' | 'asc' | 'name' | 'none';
  limit?: number;
  color_mode?: 'thresholds' | 'series';
}
