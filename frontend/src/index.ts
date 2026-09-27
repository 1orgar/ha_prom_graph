// Import all cards to register them as custom elements
import './cards/stat-card/stat-card';
import './cards/gauge-card/gauge-card';
import './cards/timeseries-card/timeseries-card';
import './cards/bar-chart-card/bar-chart-card';

// Log version
console.info(
  '%c PROMETHEUS-DASHBOARD %c v0.1.0 ',
  'color: white; background: #e65100; font-weight: bold;',
  'color: #e65100; background: white; font-weight: bold;'
);
