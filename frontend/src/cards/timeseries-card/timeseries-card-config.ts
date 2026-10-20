import { BaseCardConfig, ThresholdConfig } from '../../types';

export interface TimeseriesCardConfig extends BaseCardConfig {
  type: 'custom:prometheus-timeseries-card';
  /** one query per panel; it may return many series (one line each, palette colours) */
  query?: string;
  time_range?: string;      // e.g. '1h', '6h', '24h', '7d', default '1h'
  step?: string;            // override auto step, e.g. '60', '300'
  fill?: boolean;           // area fill, default false
  fill_opacity?: number;    // 0-100, default 20
  line_width?: number;      // default 2
  stacked?: boolean;        // stack series
  show_legend?: boolean;    // default true
  show_current?: boolean;   // current / hovered value in the legend, default false
  legend_mode?: 'list' | 'table';
  /** extra columns of the table legend (only in `legend_mode: table`) */
  legend_values?: ('last' | 'min' | 'max' | 'mean')[];
  height?: number;          // chart height in px when the panel height is auto, default 200
  min?: number;             // y axis min (empty = auto, with a labelled origin)
  max?: number;             // y axis max
  show_x_axis?: boolean;    // time axis labels, default true
  show_y_axis?: boolean;    // value axis labels, default true
  show_grid?: boolean;      // grid lines, default true
  thresholds?: ThresholdConfig[];
  /** how thresholds are drawn: `off`, `line` (dashed lines) or `area` (coloured bands) */
  threshold_style?: 'off' | 'line' | 'area';
}
