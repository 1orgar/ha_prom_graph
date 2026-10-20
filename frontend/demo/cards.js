// Card configs rendered by demo/index.html. `id` = screenshot file name (images/<id>.png).
const th = (...pairs) => pairs.map(([value, color]) => ({ value, color }));
const traffic = th([0, '#73BF69'], [70, '#FF9830'], [90, '#F2495C']);

export const DEMO_CARDS = [
  {
    id: 'stat',
    width: 360,
    config: {
      type: 'custom:prometheus-stat-card',
      title: 'Power',
      icon: 'mdi:flash',
      query: 'house_power_watts',
      unit: 'watt',
      sparkline: true,
      thresholds: th([0, '#73BF69'], [2500, '#FF9830'])
    }
  },
  {
    id: 'stat-tiles',
    width: 560,
    config: {
      type: 'custom:prometheus-stat-card',
      title: 'CPU usage',
      query: 'node_cpu_usage',
      legend_format: '{{instance}}',
      layout: 'tiles',
      unit: 'percent',
      decimals: 0,
      sparkline: true,
      thresholds: traffic
    }
  },
  {
    id: 'gauge',
    width: 560,
    config: {
      type: 'custom:prometheus-gauge-card',
      title: 'Disk usage',
      query: 'node_filesystem_usage',
      legend_format: '{{mountpoint}}',
      unit: 'percent',
      decimals: 0,
      thresholds: traffic
    }
  },
  {
    id: 'bar-gauge',
    width: 460,
    config: {
      type: 'custom:prometheus-bar-gauge-card',
      title: 'Disk usage',
      query: 'node_filesystem_usage',
      legend_format: '{{mountpoint}}',
      unit: 'percent',
      max: 100,
      display_mode: 'gradient',
      thresholds: traffic
    }
  },
  {
    id: 'timeseries',
    width: 720,
    config: {
      type: 'custom:prometheus-timeseries-card',
      title: 'Network traffic',
      time_range: '6h',
      unit: 'binBps',
      fill: true,
      fill_opacity: 15,
      legend_mode: 'table',
      legend_values: ['max', 'mean'],
      query: 'rate(node_network_receive_bytes_total[5m])',
      legend_format: '{{device}}'
    }
  },
  {
    id: 'bar',
    width: 460,
    config: {
      type: 'custom:prometheus-bar-card',
      title: 'Memory used',
      query: 'node_memory_used_bytes',
      legend_format: '{{instance}}',
      unit: 'bytes',
      palette: 'classic',
      transparent_track: true,
      value_at_end: true,
      max: 8e9,
      gradient: true,
      thresholds: [
        { value: 0, color: 'green' },
        { value: 3e9, color: 'yellow' },
        { value: 6e9, color: 'red' }
      ]
    }
  },
  {
    id: 'state-timeline',
    width: 720,
    config: {
      type: 'custom:prometheus-state-timeline-card',
      title: 'Targets',
      time_range: '24h',
      query: 'up',
      legend_format: '{{job}}',
      mappings: [
        { value: '1', text: 'UP', color: '#73BF69', transparent: true },
        { value: '0', text: 'DOWN', color: '#F2495C' }
      ]
    }
  },
  {
    id: 'pie',
    width: 460,
    config: {
      type: 'custom:prometheus-pie-card',
      title: 'Targets by job',
      query: 'count by (job) (up)',
      legend_format: '{{job}}',
      legend_values: ['value', 'percent']
    }
  },
  {
    id: 'table',
    width: 560,
    config: {
      type: 'custom:prometheus-table-card',
      title: 'Targets',
      query: 'up',
      columns: ['job', 'instance'],
      thresholds: th([0, '#F2495C'], [1, '#73BF69']),
      color_cells: true
    }
  },
  {
    id: 'heatmap',
    width: 720,
    config: {
      type: 'custom:prometheus-heatmap-card',
      title: 'HTTP request duration',
      query: 'sum by (le) (rate(http_request_duration_seconds_bucket[5m]))',
      heatmap_mode: 'histogram',
      color_scheme: 'spectral',
      time_range: '6h',
      unit: 'short'
    }
  },
  {
    id: 'alerts',
    width: 560,
    config: { type: 'custom:prometheus-alerts-card', title: 'Alerts', show_labels: true }
  },
  {
    // Dashboard variables: values of `instance` / `job` from `up`, used as $job / $instance in other cards
    id: 'variables',
    width: 560,
    config: {
      type: 'custom:prometheus-variables-card',
      variables: [
        { name: 'job', label: 'Job', query: 'up', label_name: 'job', default: 'node' },
        { name: 'instance', label: 'Instance', query: 'up{job="$job"}', label_name: 'instance', include_all: true },
        { name: 'range', label: 'Rate window', values: ['1m', '5m', '15m'], default: '5m' }
      ]
    }
  },
  {
    // Cards of one row with the same panel height (card_height) and identical titles
    id: 'row',
    width: 1000,
    row: [
      {
        width: 300,
        config: {
          type: 'custom:prometheus-stat-card',
          title: 'Power',
          icon: 'mdi:flash',
          query: 'house_power_watts',
          unit: 'watt',
          sparkline: true,
          card_height: 220,
          thresholds: th([0, '#73BF69'], [2500, '#FF9830'])
        }
      },
      {
        width: 300,
        config: {
          type: 'custom:prometheus-gauge-card',
          title: 'Targets up',
          query: 'avg(up) * 100',
          unit: 'percent',
          decimals: 0,
          card_height: 220,
          show_unfilled: false,
          thresholds: th([0, '#F2495C'], [50, '#FADE2A'], [90, '#73BF69'])
        }
      },
      {
        width: 400,
        config: {
          type: 'custom:prometheus-timeseries-card',
          title: 'Scrape duration',
          query: 'scrape_duration_seconds',
          legend_format: '{{job}}',
          time_range: '1h',
          unit: 's',
          card_height: 220,
          show_legend: false
        }
      }
    ]
  }
];
