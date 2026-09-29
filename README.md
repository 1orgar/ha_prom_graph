# Prometheus Dashboard for Home Assistant

<p align="center">
  <img src="https://raw.githubusercontent.com/1orgar/ha_prom_graph/main/images/icon.png" alt="Prometheus Dashboard" width="160" height="160">
</p>

<p align="center">
  <a href="https://github.com/1orgar/ha_prom_graph/releases"><img src="https://img.shields.io/github/v/release/1orgar/ha_prom_graph?style=flat-square" alt="Release"></a>
  <a href="https://github.com/1orgar/ha_prom_graph/blob/main/LICENSE"><img src="https://img.shields.io/github/license/1orgar/ha_prom_graph?style=flat-square" alt="License"></a>
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square" alt="HACS"></a>
  <img src="https://img.shields.io/badge/HA-%3E%3D%202025.4-blue?style=flat-square" alt="Home Assistant">
</p>

Backend integration that connects Home Assistant to one or more Prometheus servers
(or compatible APIs — VictoriaMetrics, Thanos, Mimir) and proxies PromQL queries over the HA websocket API.

> 📊 **Dashboard cards** live in a separate repository:
> **[ha_prom_graph_cards](https://github.com/1orgar/ha_prom_graph_cards)** (HACS → *Dashboard*).

![Dashboard built with ha_prom_graph_cards](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/row.png)

| | |
|:---:|:---:|
| ![Time series](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/timeseries.png) | ![Stat tiles](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/stat-tiles.png) |
| ![State timeline](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/state-timeline.png) | ![Alerts](https://raw.githubusercontent.com/1orgar/ha_prom_graph_cards/main/images/alerts.png) |

## ✨ Features

- 🔌 Multiple Prometheus servers, Basic Auth, optional SSL verification
- 🧪 **Test connection** button in the setup dialog — shows version, response time and targets up before saving
- 🔁 Reconfigure an existing server from the UI (also with connection test)
- 📈 **PromQL sensors** — any instant query becomes a Home Assistant sensor (automations, history, statistics)
- 🔔 **PromQL alerts** — alert rules with a firing window (`for`), every series tracked separately, binary sensor + events
- 📲 **Alert notifications** — system notifications and push to the mobile app, critical alerts as critical push
- 🚨 **Alerts sensor** — number of firing alerts, alert list in attributes (+ `prometheus_dashboard/alerts` for the Alerts card)
- ♻️ **Request de-duplication + cache** — identical queries from all cards, tabs and sensors share one request
- 🩺 Diagnostics (credentials redacted) and a Repairs issue while a server is unreachable
- 🔒 Browser never talks to Prometheus directly — all queries go through HA
- 🌍 English / Русский

## 🚀 Installation

### HACS (recommended)

1. HACS → **⋮** → **Custom repositories** → add `https://github.com/1orgar/ha_prom_graph`, type **Integration**.
2. Find **Prometheus Dashboard**, click **Download**, restart Home Assistant.
3. Install the cards: add `https://github.com/1orgar/ha_prom_graph_cards` as a **Dashboard** repository and download it.

### Manual

Copy `custom_components/prometheus_dashboard/` to `<config>/custom_components/` and restart Home Assistant.

## ⚙️ Setup

1. **Settings → Devices & services → Add integration → Prometheus Dashboard**.
2. Enter the URL (e.g. `http://192.168.1.100:9090`) and optional credentials.
3. Press **Test connection**. On success you'll see the server version, response time and targets up —
   choose **Save** or **Change settings**.

Add more servers by repeating the steps. To change a server later use **⋮ → Reconfigure** on the integration entry.

### PromQL sensors

On the integration page press **Add PromQL sensor**, enter a name and an instant query (e.g. `node_load1`).
The query is executed before saving — invalid PromQL or an empty result is reported in the dialog.
If the query returns several series choose how to combine them (first / sum / avg / min / max / count);
all series and their labels are available in the sensor attributes. Unit, device class, state class
(`measurement` enables long-term statistics) and precision are optional.

### PromQL alerts

A sensor only shows a value. To get an **alert** press **Add PromQL alert** on the integration page
(it works like a Prometheus alerting rule, evaluated by Home Assistant on every poll):

| Field | Description |
|-------|-------------|
| Query | instant query. Either the query selects the problem itself (`up == 0`, `node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1`) with condition **any series**, or its values are compared with a threshold (`>`, `≥`, `<`, `≤`, `=`, `≠`) |
| For (firing window) | how long a series must stay active before the alert fires; empty = at once |
| Severity / Summary | shown in the Alerts card; summary supports `{{ $value }}` and `{{ $labels.instance }}` |

**Every series of the query is an alert instance of its own** (like Prometheus): `inactive → pending → firing`.
A series that recovers before the window ends starts the window again.

- `binary_sensor.<server>_<alert>` (device class *problem*) is **on** while at least one series is firing;
  attributes: `state` (inactive / pending / firing), `firing_count`, `pending_count`, `series`, `pending_series`
  (labels, value, active since, summary). The series lists are not stored in the recorder.
- On every change an event `prometheus_dashboard_alert` is fired
  (`alert`, `state: firing | resolved`, `severity`, `labels`, `value`, `summary`) — one per series, handy for notifications:

```yaml
triggers:
  - trigger: event
    event_type: prometheus_dashboard_alert
    event_data: { state: firing }
actions:
  - action: notify.mobile_app_phone
    data:
      title: "{{ trigger.event.data.alert }}"
      message: "{{ trigger.event.data.summary or trigger.event.data.labels }}"
```

- The Alerts card (`prometheus_dashboard/alerts`) lists these alerts together with the Prometheus rules
  (`source: home_assistant`, filter *Source* in the card).
- The state is kept in memory: after a restart of Home Assistant pending windows start again.

### Alert notifications

Firing alerts are sent **without automations** (**⋮ → Configure → Alert notifications**):

- **System notifications** (on by default): one notification per alert in the sidebar with the firing
  series; updated while series change and removed automatically when the alert is resolved.
- **Push** to the selected `notify` services, e.g. `notify.mobile_app_<phone>` of the Companion app:
  one message per alert and poll with the newly firing series, and a *resolved* message that replaces it on the phone.
- **Critical** severity is sent as a *critical* push: on iOS it plays a sound in silent / focus mode
  (allow *Critical alerts* for the Home Assistant app), on Android it is delivered at once with high priority
  through the alarm stream. *Warning* is sent as a time-sensitive / high-priority push.
- Filters: severities (critical / warning / info / other) and sources — PromQL alerts of Home Assistant and
  alerting rules of the Prometheus server (these need the alerts sensor). Every PromQL alert also has a **Notify** switch.
- After a restart of Home Assistant alerts that are already firing are not pushed again.

The `prometheus_dashboard_alert` event is still fired for custom automations.

### Options

**⋮ → Configure**:

| Option | Default | Description |
|--------|---------|-------------|
| Polling interval | 30 s | update interval of PromQL sensors and the alerts sensor |
| Query cache TTL | 5 s | identical queries within this time share one request; `0` disables the cache (concurrent requests are still merged) |
| Alerts sensor | off | `sensor.<server>_firing_alerts` with pending count and alert list in attributes |
| Alert notifications | system: on, push: none | see [Alert notifications](#alert-notifications) |

## 🧩 Websocket API

Used by the cards; `entry_id` is optional — the first configured server is used when omitted.

| Command | Parameters |
|---------|------------|
| `prometheus_dashboard/entries` | — |
| `prometheus_dashboard/query` | `query`, `time?` |
| `prometheus_dashboard/query_range` | `query`, `start`, `end`, `step` |
| `prometheus_dashboard/labels` | — |
| `prometheus_dashboard/label_values` | `label` |
| `prometheus_dashboard/series` | `match?: string[]` |
| `prometheus_dashboard/metadata` | `metric?` |
| `prometheus_dashboard/alerts` | — |

## 🧪 Development

```bash
pip install -r requirements_test.txt   # Python 3.14
pytest -q
```

**Releases are automatic:** bump `version` in `custom_components/prometheus_dashboard/manifest.json`,
commit and push to `main`. After hassfest and tests pass, CI creates the tag `vX.Y.Z` and a GitHub release
(versions like `1.0.0-beta.1` become pre-releases). If the tag already exists nothing happens.

## 🖼️ Brand icon

The icon is shipped in `custom_components/prometheus_dashboard/brand/` (`icon.png` 256×256, `icon@2x.png` 512×512,
transparent background; HA uses the icon as the logo fallback).

- **Settings → Devices & services** (HA ≥ 2026.3): served locally by the built-in `brands` proxy — shown right after
  installing and restarting HA.
- **HACS store list**: the current HACS frontend still loads icons directly from
  `https://brands.home-assistant.io/_/prometheus_dashboard/icon.png`, which returns the *"icon not available"*
  placeholder until the domain is added to [home-assistant/brands](https://github.com/home-assistant/brands)
  (`custom_integrations/prometheus_dashboard/icon.png` + `icon@2x.png`). The HACS validation check `brands`
  already passes thanks to the local `brand/` folder.

## 🏗️ Architecture

```
Browser (ha_prom_graph_cards)
    ↕ WebSocket (authenticated by HA)
HA backend (this integration)
    ↕ HTTP
Prometheus server
```

## 📄 License

MIT — see [LICENSE](LICENSE).
