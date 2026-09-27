import { BaseCardConfig, ThresholdConfig } from '../../types';

export interface GaugeCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-gauge-card';
  min?: number;            // default 0
  max?: number;            // default 100
  unit?: string;
  decimals?: number;
  thresholds?: ThresholdConfig[];
  arc_width?: number;      // SVG arc width, default 8
}
