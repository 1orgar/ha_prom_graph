export function humanizeNumber(value: number): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e9) return (value / 1e9).toFixed(1) + 'B';
  if (abs >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return (value / 1e3).toFixed(1) + 'K';
  return parseFloat(value.toFixed(2)).toString();
}

export function formatValue(value: number, decimals: number = 2, unit?: string): string {
  if (isNaN(value) || value === null || value === undefined) return '-';

  if (unit === 'bytes' || unit === 'B') {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (value === 0) return '0 B';
    const i = Math.floor(Math.log(value) / Math.log(k));
    return parseFloat((value / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  if (unit === 'percent' || unit === '%') {
    return parseFloat(value.toFixed(decimals)) + '%';
  }

  if (unit === 's' || unit === 'seconds') {
    if (value < 60) return parseFloat(value.toFixed(decimals)) + ' s';
    const mins = value / 60;
    if (mins < 60) return parseFloat(mins.toFixed(decimals)) + ' m';
    const hours = mins / 60;
    if (hours < 24) return parseFloat(hours.toFixed(decimals)) + ' h';
    const days = hours / 24;
    return parseFloat(days.toFixed(decimals)) + ' d';
  }

  if (unit === 'short') {
    return humanizeNumber(value);
  }
  
  if (unit === 'bps') {
    const k = 1000;
    const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
    if (value === 0) return '0 bps';
    const i = Math.floor(Math.log(value) / Math.log(k));
    return parseFloat((value / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  const formatted = parseFloat(value.toFixed(decimals)).toString();
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatMetricName(metric: Record<string, string>): string {
  if (metric.__name__) {
    const name = metric.__name__;
    const labels = Object.entries(metric)
      .filter(([k]) => k !== '__name__')
      .map(([k, v]) => `${k}="${v}"`)
      .join(', ');
    return labels ? `${name}{${labels}}` : name;
  }
  return Object.values(metric).join(' - ') || 'Unknown';
}
