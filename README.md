# Prometheus Dashboard for Home Assistant

<p align="center">
  <img src="images/icon.jpg" alt="Prometheus Dashboard" width="150" height="150" style="border-radius: 20px;">
</p>

<p align="center">
  <a href="https://github.com/1orgar/ha_prom_graph/releases"><img src="https://img.shields.io/github/v/release/1orgar/ha_prom_graph?style=flat-square" alt="Release"></a>
  <a href="https://github.com/1orgar/ha_prom_graph/blob/main/LICENSE"><img src="https://img.shields.io/github/license/1orgar/ha_prom_graph?style=flat-square" alt="License"></a>
  <a href="https://github.com/1orgar/ha_prom_graph/stargazers"><img src="https://img.shields.io/github/stars/1orgar/ha_prom_graph?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square" alt="HACS"></a>
  <img src="https://img.shields.io/badge/HA-%3E%3D%202024.1-blue?style=flat-square" alt="Home Assistant">
</p>

<p align="center">
  <strong>Grafana-style dashboard cards for Home Assistant powered by Prometheus metrics</strong>
</p>

---

## ✨ Features

- 🔥 **Direct Prometheus queries** — PromQL support, no intermediate entities
- 📊 **4 card types** — Stat, Gauge, Time Series, Bar Chart
- 🎨 **Mushroom/iOS design** — clean, rounded, dark mode support
- ⚡ **Lightweight** — uPlot charts (~8KB gzipped)
- 🔒 **Secure** — all queries proxied through HA backend (WebSocket API)
- 🛠️ **Visual editor** — GUI configuration for all cards
- 📦 **HACS compatible** — easy installation
- 🔄 **Auto-refresh** — configurable polling interval

## 📸 Card Types

### Stat Card
Display a single metric value with optional sparkline.

```yaml
type: custom:prometheus-stat-card
query: 'node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100'
name: 'RAM Available'
icon: mdi:memory
unit: '%'
decimals: 1
sparkline: true
sparkline_hours: 24
thresholds:
  - value: 20
    color: red
  - value: 50
    color: yellow
  - value: 100
    color: green
```

### Gauge Card
Radial gauge with threshold zones.

```yaml
type: custom:prometheus-gauge-card
query: 'avg(node_load1)'
name: 'CPU Load (1m)'
min: 0
max: 8
thresholds:
  - value: 2
    color: green
  - value: 5
    color: yellow
  - value: 8
    color: red
```

### Time Series Card
Line/area charts powered by uPlot (same engine as Grafana).

```yaml
type: custom:prometheus-timeseries-card
title: 'Network Traffic'
time_range: 6h
series:
  - query: 'rate(node_network_receive_bytes_total{device="eth0"}[5m])'
    name: 'RX'
    color: '#4CAF50'
    fill: true
  - query: 'rate(node_network_transmit_bytes_total{device="eth0"}[5m])'
    name: 'TX'
    color: '#2196F3'
    fill: true
unit: 'bytes/s'
```

### Bar Chart Card
Horizontal or vertical bar chart grouped by Prometheus labels.

```yaml
type: custom:prometheus-bar-card
query: 'node_filesystem_avail_bytes / node_filesystem_size_bytes * 100'
name: 'Disk Usage by Mount'
group_by: 'mountpoint'
orientation: horizontal
unit: '%'
max: 100
thresholds:
  - value: 20
    color: red
  - value: 50
    color: yellow
  - value: 100
    color: green
```

## 🚀 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant
2. Click **⋮** → **Custom repositories**
3. Add `https://github.com/1orgar/ha_prom_graph` with category **Integration**
4. Search for "Prometheus Dashboard" and install
5. Restart Home Assistant

### Manual Installation

1. Download the latest release
2. Copy `custom_components/prometheus_dashboard/` to your HA `config/custom_components/`
3. Restart Home Assistant

## ⚙️ Setup

1. Go to **Settings** → **Devices & Services** → **Add Integration**
2. Search for **Prometheus Dashboard**
3. Enter your Prometheus server URL (e.g., `http://prometheus.local:9090`)
4. Optionally configure Basic Auth credentials
5. Click **Submit**

You can add multiple Prometheus servers by repeating the process.

## 📝 Configuration

All cards support these common options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entry_id` | string | auto | Prometheus server instance ID |
| `query` | string | required | PromQL query expression |
| `name` | string | — | Card title |
| `refresh_interval` | number | 30 | Auto-refresh interval in seconds |

### Visual Editor

All cards include a GUI editor — click the pencil icon when editing a dashboard to configure cards visually.

## 🏗️ Architecture

```
Browser (Lovelace Cards)
    ↕ WebSocket (auto-authenticated)
HA Backend (Integration)
    ↕ HTTP (aiohttp)
Prometheus Server
```

- **Frontend**: TypeScript + Lit + uPlot, compiled to a single ES module
- **Backend**: Python HA integration with WebSocket API proxy
- **Security**: All Prometheus queries proxied through HA — no direct browser-to-Prometheus access needed

## 🔧 Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- Home Assistant dev environment

### Build Frontend

```bash
cd frontend
npm install
npm run build
```

The compiled `prometheus-cards.js` will be in `frontend/dist/`.

### Watch Mode

```bash
cd frontend
npm run watch
```

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- [Home Assistant](https://www.home-assistant.io/) — the smart home platform
- [Prometheus](https://prometheus.io/) — monitoring & alerting
- [uPlot](https://github.com/leeoniya/uPlot) — lightweight charting (same engine as Grafana)
- [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom) — design inspiration
