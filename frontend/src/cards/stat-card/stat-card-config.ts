import { BaseCardConfig, ThresholdConfig } from '../../types';

export interface StatCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-stat-card';
  icon?: string;           // mdi icon, e.g. 'mdi:memory'
  unit?: string;           // display unit
  decimals?: number;       // decimal places, default 1
  sparkline?: boolean;     // show mini sparkline, default false
  sparkline_hours?: number; // sparkline time range, default 24
  thresholds?: ThresholdConfig[];
}
