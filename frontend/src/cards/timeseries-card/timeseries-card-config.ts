import { BaseCardConfig, SeriesConfig } from '../../types';

export interface TimeseriesCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-timeseries-card';
  title?: string;
  series: SeriesConfig[];   // array of queries with display options
  time_range?: string;      // e.g. '1h', '6h', '24h', '7d', default '1h'
  step?: string;            // override auto step, e.g. '60', '300'
  unit?: string;
  decimals?: number;
  fill?: boolean;           // default false
  show_legend?: boolean;    // default true
  height?: number;          // chart height in px, default 200
}
