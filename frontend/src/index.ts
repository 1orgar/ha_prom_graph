// Entry of the bundle shipped with the integration (custom_components/prometheus_dashboard/www/).
// A second copy of the bundle on the page (the former separate HACS plugin "ha_prom_graph_cards",
// or the resource added twice) is harmless: elements are defined only once (shared/define.ts)
// and the first copy wins.
import { localize } from './localize';
import './cards';

declare const __VERSION__: string;

const DOCS_URL = 'https://github.com/1orgar/ha_prom_graph/blob/main/CARDS.md';

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

function register(): void {
  w.customCards = w.customCards || [];
  for (const card of CARDS) {
    if (w.customCards.some((c: { type: string }) => c.type === card.type)) continue;
    w.customCards.push({
      type: card.type,
      name: localize(`${card.key}_name`),
      description: localize(`${card.key}_desc`),
      preview: true,
      documentationURL: DOCS_URL
    });
  }
  console.info(
    `%c PROMETHEUS-CARDS %c v${__VERSION__} `,
    'color: white; background: #e65100; font-weight: bold;',
    'color: #e65100; background: white; font-weight: bold;'
  );
}

if (w.__PROM_CARDS_VERSION__) {
  console.warn(
    `Prometheus Dashboard cards v${__VERSION__}: v${w.__PROM_CARDS_VERSION__} is already loaded and is used. ` +
      'Remove the old "ha_prom_graph_cards" dashboard resource / HACS plugin - the cards ship with the integration now.'
  );
} else {
  w.__PROM_CARDS_VERSION__ = __VERSION__;
  register();
}
