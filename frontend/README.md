# Prometheus Graph Cards for Home Assistant

<p align="center">
  <img src="https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/icon.png" alt="Prometheus Graph Cards" width="150" height="150">
</p>

<p align="center">
  <a href="https://github.com/1orgar/ha_prom_graph_cards/releases"><img src="https://img.shields.io/github/v/release/1orgar/ha_prom_graph_cards?style=flat-square" alt="Release"></a>
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square" alt="HACS"></a>
  <img src="https://img.shields.io/badge/HA-%3E%3D%202024.8-blue?style=flat-square" alt="Home Assistant">
</p>

Grafana-style dashboard cards for Home Assistant, powered by PromQL.

> **Requires the backend integration** [Prometheus Dashboard (`ha_prom_graph`)](https://github.com/1orgar/ha_prom_graph).
> The cards never talk to Prometheus directly — all queries go through the HA websocket API.

![Row of panels](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/row.png)

## 🖼️ Screenshots

| | |
|:---:|:---:|
| **Stat** ![Stat](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/stat.png) | **Stat — tiles** ![Stat tiles](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/stat-tiles.png) |
| **Gauge** ![Gauge](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/gauge.png) | **Bar Gauge** ![Bar gauge](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/bar-gauge.png) |
| **Time Series** ![Time series](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/timeseries.png) | **State Timeline** ![State timeline](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/state-timeline.png) |
| **Bar Chart** ![Bar chart](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/bar.png) | **Pie / Donut** ![Pie](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/pie.png) |
| **Table** ![Table](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/table.png) | **Alerts** ![Alerts](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/alerts.png) |
| **Heatmap** ![Heatmap](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/heatmap.png) | **Card picker** (built-in demo data) ![Card picker](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/card-picker.png) |
| **Variables** ![Variables](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/variables.png) | |

## ✨ Features

- 📊 **11 cards** — Stat (value or Grafana-like gradient tiles), Gauge, Bar Gauge, Time Series (uPlot), Bar Chart,
  State Timeline, Pie / Donut, Table, Heatmap, Alerts list, Variables
- 🎛️ **Dashboard variables** — Grafana-like drop-downs (`$instance`, `${job}`) substituted into the queries of all cards
- 🔔 **Create alert from a card** — a PromQL alert of the integration from the panel query and threshold;
  **Silence** alerts in Alertmanager from the Alerts card
- 💤 Cards outside the screen are not polled; they refresh when scrolled into view
- 🧱 **Same editor layout everywhere** — Panel / Query / Display / Thresholds, one query per panel
- 📐 **Equal panel heights** — identical titles, `card_height` or the Sections rows; auto height when empty
- ⌨️ **PromQL editor** — autocomplete for metrics, functions, labels and label values + **Test query** button
- 📐 **Sections view** support (`getGridOptions`), polling pauses on hidden tabs
- ♻️ Identical queries of all cards / tabs are merged and cached by the backend
- 🪟 **Transparent background** option on every card
- 🧩 **Listed in the card picker** — *Add card → Custom / Community*, with live previews rendered from built-in demo data
- 🛠️ **Fully visual editor** — every option and threshold is editable in the UI, no YAML needed
- 🔢 **Multi-series everywhere** — a query returning many series draws many lines / stat rows / gauges / bars
- 🚨 **Alerts** — Prometheus rules and PromQL alerts of Home Assistant, firing window filter, every series listed
- 🎨 **Grafana palettes** — classic palette + by-series schemes, Grafana-like legend (`{{label}}` format, table with min/max/mean, click to isolate)
- 📏 **Grafana units** — pick a unit from a list (bytes IEC/SI, bits/s, s → min → hour, W → kW, %, °C, ₽ …), values are scaled within the dimension
- 🔌 **Multiple Prometheus servers** — pick a server from a dropdown in the editor
- 🌍 English / Русский

## 🚀 Installation

### HACS (recommended)

1. Install the backend integration [ha_prom_graph](https://github.com/1orgar/ha_prom_graph) and add a Prometheus server.
2. HACS → **⋮** → **Custom repositories** → add `https://github.com/1orgar/ha_prom_graph_cards`, type **Dashboard**.
3. Find **Prometheus Graph Cards** and click **Download**. HACS adds the dashboard resource automatically.
4. Reload the browser page (clear cache if the cards don't appear).

### Manual

1. Download `ha_prom_graph_cards.js` from the [latest release](https://github.com/1orgar/ha_prom_graph_cards/releases).
2. Copy it to `<config>/www/ha_prom_graph_cards.js`.
3. **Settings → Dashboards → ⋮ → Resources → Add resource**: URL `/local/ha_prom_graph_cards.js`, type **JavaScript module**.

## 🧩 Usage

Edit a dashboard → **Add card** → scroll to **Custom cards** (or search "Prometheus") → pick a card.
Everything is configured in the visual editor.

| Card | Type |
|------|------|
| Prometheus Stat | `custom:prometheus-stat-card` |
| Prometheus Gauge | `custom:prometheus-gauge-card` |
| Prometheus Time Series | `custom:prometheus-timeseries-card` |
| Prometheus Bar Chart | `custom:prometheus-bar-card` |
| Prometheus State Timeline | `custom:prometheus-state-timeline-card` |
| Prometheus Pie Chart | `custom:prometheus-pie-card` |
| Prometheus Bar Gauge | `custom:prometheus-bar-gauge-card` |
| Prometheus Table | `custom:prometheus-table-card` |
| Prometheus Heatmap | `custom:prometheus-heatmap-card` |
| Prometheus Alerts | `custom:prometheus-alerts-card` |
| Prometheus Variables | `custom:prometheus-variables-card` |

In any query field press **Ctrl+Space** for suggestions (they also appear while typing) and
**Test query** to see the number of returned series, sample labels or the PromQL error.

**Create alert** (admins, backend v0.6+) turns the query into a PromQL alert of the integration: name = panel title,
threshold = the first threshold above the base one; condition, `for` and severity can be changed before saving.
The alert appears on the integration page and in the Alerts card. With Alertmanager configured in the integration,
the Alerts card shows a **Silence** button per series and marks silenced alerts.

### Dashboard variables

Add a **Prometheus Variables** card and use the variables in the queries of any card on the page:

```yaml
type: custom:prometheus-variables-card
variables:
  - name: job
    query: up                 # values = label `label_name` of the result (like Grafana label_values)
    label_name: job
  - name: instance
    query: up{job="$job"}     # chained: reloads when $job changes
    label_name: instance
    multi: true
    include_all: true
  - name: window
    values: [1m, 5m, 15m]     # fixed list
    default: 5m
```

```promql
rate(node_network_receive_bytes_total{instance=~"$instance"}[$window])
```

- `$name` and `${name}` are replaced; several values (or **All**) become `a|b|c` — use them with `=~`.
  Values inside `=~"…"` are regex-escaped.
- A change refetches only the cards that use the variable. The selection is remembered in the browser.
- Optional `regex` filters the values (the first capture group is used), `layout: column` stacks the drop-downs.

### Editor layout

Every card editor has the same four blocks:

1. **Panel** — title, panel height, transparent background (+ icon for Stat)
2. **Query** — server, PromQL, legend format, refresh interval, time range / step
3. **Display** — unit, decimals, palette, sorting, axes, legend … (how the returned series are drawn)
4. **Thresholds** — value → colour, any threshold can be **transparent**

**One query per panel.** A query may return many series — each gets its own palette colour and legend entry.
Configs of v0.2–v0.6 with several `series:` are converted automatically (the first query is kept;
combine several metrics in PromQL, e.g. `a or b`).

### Panel height

All titles look the same on every card. `card_height` (px) fixes the panel height — give the cards of one row
the same value (or set the rows in the Sections layout editor) and they line up; charts, bars, tiles and the
heatmap stretch to fill the panel. Empty = **auto** (content height).

![Row of equally high panels](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/row.png)

<details>
<summary>YAML reference (optional)</summary>

Common options: `entry_id` (server, empty = first configured), `query`, `title`, `card_height` (px, empty = auto),
`transparent`, `refresh_interval` (s, default 30),
`unit` (Grafana unit id: `bytes`, `decbytes`, `bps`, `binBps`, `s`, `ms`, `dtdurations`, `percent`, `percentunit`,
`watt`, `kwatth`, `celsius`, `short`, … or any custom suffix), `decimals` (empty = auto),
`legend_format` (`{{instance}} {{job}}`), `palette` (`classic`, `green-yellow-red`, `blues`, `greens`, `reds`, `purples`, `single`),
`thresholds: [{ value, color, transparent? }]`.

```yaml
type: custom:prometheus-stat-card
title: RAM available
query: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100
icon: mdi:memory
unit: percent
sparkline: true
thresholds:
  - { value: 0, color: '#F44336' }
  - { value: 20, color: '#FFC107' }
  - { value: 50, color: '#4CAF50' }
```

```yaml
type: custom:prometheus-gauge-card
title: CPU load (1m)
query: avg(node_load1)
min: 0
max: 8
show_unfilled: false      # no background arc
```

```yaml
type: custom:prometheus-timeseries-card
title: Network
query: rate(node_network_receive_bytes_total{device!="lo"}[5m])
legend_format: '{{device}} rx'
unit: binBps
time_range: 6h
fill: true
show_current: false       # current / hovered value in the legend (default off)
legend_mode: table
legend_values: [max, mean] # only in the table legend
show_x_axis: true          # axis labels can be switched off separately
show_y_axis: true
threshold_style: line      # off | line | area
# min: 0                   # empty = auto, the axis always starts with a labelled value
```

```yaml
type: custom:prometheus-bar-card
title: Memory used
query: node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes
legend_format: '{{instance}}'
unit: bytes
# bar_height: 24           # empty = auto (bars share a fixed panel height)
transparent_track: true    # no background for the unfilled part
value_at_end: true         # value right after the bar end (needs transparent_track)
max: 16000000000
gradient: true             # threshold colours blended along the bar (colour mode "thresholds")
thresholds:
  - { value: 0, color: green }
  - { value: 8000000000, color: yellow }
  - { value: 12000000000, color: red }
```

```yaml
type: custom:prometheus-state-timeline-card
title: Targets
query: up
legend_format: '{{job}}'
time_range: 24h
mappings:
  - { value: '1', text: UP, color: '#73BF69', transparent: true }   # hide the normal state
  - { value: '0', text: DOWN, color: '#F2495C' }
```

```yaml
type: custom:prometheus-pie-card
title: Disk usage by mount
query: node_filesystem_size_bytes - node_filesystem_avail_bytes
legend_format: '{{mountpoint}}'
unit: bytes
legend_values: [value, percent]
limit: 5
```

```yaml
type: custom:prometheus-table-card
query: up
columns: [job, instance]
thresholds: [{ value: 0, color: '#F2495C' }, { value: 1, color: '#73BF69' }]
color_cells: true
```

```yaml
type: custom:prometheus-heatmap-card
title: Request duration
# buckets must be rates / increases; raw _bucket counters are converted automatically (counters: auto)
query: sum by (le) (rate(prometheus_http_request_duration_seconds_bucket[5m]))
heatmap_mode: histogram   # rows = le (upper bound), or "series"
color_scheme: spectral
time_range: 6h
```

```yaml
type: custom:prometheus-alerts-card
title: Alerts
states: [firing, pending]
min_active: 5m            # firing window: hide alerts active for less than 5 minutes
source: ''                # '' = all, prometheus = server rules, local = PromQL alerts of Home Assistant
severities: critical,warning
show_labels: true
group_by_name: false      # default: every series of an alert is its own row
```

</details>

## 🔧 Development

```bash
npm install
npm run watch   # dev build
npm test        # unit tests (vitest)
npm run build   # production build -> dist/ha_prom_graph_cards.js
```

`dist/ha_prom_graph_cards.js` is committed (HACS downloads it). Rebuild before committing.

**Releases are automatic:** bump `version` in `package.json`, rebuild, commit and push to `main`.
After lint / tests / build pass, CI creates the tag `vX.Y.Z` and a GitHub release with the bundle
(versions like `1.0.0-beta.1` become pre-releases). If the tag already exists nothing happens.

**Screenshots** (`images/*.png`) are generated from `demo/` with the built-in demo data:

```bash
npm run build
npm i --no-save playwright-core
node demo/screenshots.mjs   # uses the installed Google Chrome (CHROME_PATH=... to override)
```

Card previews in *Add card* use the same demo data (`src/demo/demo-data.ts`), so they look good
on any Prometheus server; real queries run once the card is added.

## 📄 License

MIT
