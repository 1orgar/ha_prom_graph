// Import all cards (and their editors) to register them as custom elements
import './cards/stat-card/stat-card';
import './cards/gauge-card/gauge-card';
import './cards/timeseries-card/timeseries-card';
import './cards/bar-chart-card/bar-chart-card';
import './cards/state-timeline-card/state-timeline-card';
import './cards/pie-chart-card/pie-chart-card';
import './cards/bar-gauge-card/bar-gauge-card';
import './cards/table-card/table-card';
import './cards/heatmap-card/heatmap-card';
import './cards/alerts-card/alerts-card';
import './cards/variables-card/variables-card';
import { localize } from './localize';

declare const __VERSION__: string;

const REPO_URL = 'https://github.com/1orgar/ha_prom_graph_cards';

// Register cards in the dashboard "Add card" picker (Community / Custom section)
const CARDS = [
  { type: 'prometheus-stat-card', key: 'stat' },
  { type: 'prometheus-gauge-card', key: 'gauge' },
  { type: 'prometheus-timeseries-card', key: 'timeseries' },
  { type: 'prometheus-bar-card', key: 'bar' },
  { type: 'prometheus-state-timeline-card', key: 'timeline' },
  { type: 'prometheus-pie-card', key: 'pie' },
  { type: 'prometheus-bar-gauge-card', key: 'bargauge' },
  { type: 'prometheus-table-card', key: 'table' },
  { type: 'prometheus-heatmap-card', key: 'heatmap' },
  { type: 'prometheus-alerts-card', key: 'alerts' },
  { type: 'prometheus-variables-card', key: 'variables' }
];

const w = window as any;
w.customCards = w.customCards || [];
for (const card of CARDS) {
  if (w.customCards.some((c: { type: string }) => c.type === card.type)) continue;
  w.customCards.push({
    type: card.type,
    name: localize(`${card.key}_name`),
    description: localize(`${card.key}_desc`),
    preview: true,
    documentationURL: REPO_URL
  });
}

console.info(
  `%c PROMETHEUS-CARDS %c v${__VERSION__} `,
  'color: white; background: #e65100; font-weight: bold;',
  'color: #e65100; background: white; font-weight: bold;'
);
