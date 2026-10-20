import { BaseCardConfig } from '../../types';

export interface PieChartCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-pie-card';
  /** one instant query per panel; every returned series is one slice */
  query?: string;
  pie_type?: 'pie' | 'donut';      // default donut
  donut_width?: number;            // % of radius, default 40
  show_legend?: boolean;           // default true
  legend_position?: 'right' | 'bottom';
  legend_values?: ('value' | 'percent')[];
  show_labels?: boolean;           // percent labels on slices, default false
  show_total?: boolean;            // total in the donut hole, default true
  sort?: 'desc' | 'asc' | 'none';  // default desc
  limit?: number;                  // top N slices, the rest -> "Other"
  size?: number;                   // chart diameter px, default 180
}
