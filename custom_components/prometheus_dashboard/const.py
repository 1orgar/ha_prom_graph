"""Constants for the Prometheus Dashboard integration."""

DOMAIN = "prometheus_dashboard"
CONF_PROMETHEUS_URL = "prometheus_url"
CONF_NAME = "name"
CONF_USERNAME = "username"
CONF_PASSWORD = "password"
CONF_VERIFY_SSL = "verify_ssl"
CONF_BEARER_TOKEN = "bearer_token"  # `Authorization: Bearer ...` (Grafana Cloud, Mimir, Thanos behind a proxy)
CONF_ORG_ID = "org_id"              # `X-Scope-OrgID` tenant header (Mimir, Cortex, Loki style multi-tenancy)

DEFAULT_NAME = "Prometheus"
REQUEST_TIMEOUT = 15
TEST_TIMEOUT = 10

# Transient network errors (connection reset, 502 / 503 / 504) are retried after these delays
RETRY_DELAYS: tuple[float, ...] = (0.5, 1.5)

# Options (Settings -> Integration -> Configure)
CONF_CACHE_TTL = "cache_ttl"
CONF_SCAN_INTERVAL = "scan_interval"
CONF_ALERTS = "alerts_enabled"

DEFAULT_CACHE_TTL = 5          # seconds; identical queries within this window share one response
DEFAULT_SCAN_INTERVAL = 30     # seconds; PromQL sensors / alerts polling
MAX_CACHE_ENTRIES = 500

# Sensor subentries
SUBENTRY_SENSOR = "sensor"
CONF_QUERY = "query"
CONF_UNIT = "unit_of_measurement"
CONF_DEVICE_CLASS = "device_class"
CONF_STATE_CLASS = "state_class"
CONF_PRECISION = "precision"
CONF_AGGREGATE = "aggregate"

AGGREGATES = ["first", "sum", "avg", "min", "max", "count"]

# Alert subentries (PromQL alert rules evaluated by Home Assistant)
SUBENTRY_ALERT = "alert"
CONF_CONDITION = "condition"
CONF_THRESHOLD = "threshold"
CONF_FOR = "for"
CONF_SEVERITY = "severity"
CONF_SUMMARY = "summary"

CONDITION_ANY = "any"
# translation keys must match [a-z0-9_]+, so no `>` style symbols here
CONDITIONS = [CONDITION_ANY, "gt", "gte", "lt", "lte", "eq", "ne"]
SEVERITIES = ["critical", "warning", "info"]

CONF_NOTIFY = "notify"  # per alert rule: send notifications, default true
CONF_KEEP_FIRING_FOR = "keep_firing_for"  # per alert rule: stay firing this long after the condition cleared

EVENT_ALERT = f"{DOMAIN}_alert"
MAX_ALERT_SERIES_ATTRIBUTE = 50

# Notifications of firing alerts (options of the server)
CONF_NOTIFY_PERSISTENT = "notify_persistent"      # system notifications (sidebar), default true
CONF_NOTIFY_SERVICES = "notify_services"          # notify.* services for push, e.g. mobile_app_phone
CONF_NOTIFY_SEVERITIES = "notify_severities"      # severities sent as push
CONF_NOTIFY_SOURCES = "notify_sources"            # local (Home Assistant rules) / prometheus (server rules)
CONF_NOTIFY_CRITICAL = "notify_critical"          # critical severity -> critical push (iOS) / alarm stream (Android)
CONF_NOTIFY_RESOLVED = "notify_resolved"          # push when an alert is resolved, default true
CONF_NOTIFY_REPEAT = "notify_repeat"              # minutes between reminders of a still firing alert, 0 = off
CONF_NOTIFY_REPEAT_SEVERITIES = "notify_repeat_severities"  # severities that get reminders, default critical

# Alertmanager (options): silences are honoured by notifications, shown in the Alerts card and
# can be created with the "Silence" button of a push notification
CONF_ALERTMANAGER_URL = "alertmanager_url"
CONF_SILENCE_DURATION = "silence_duration"        # minutes, silence created from a push notification
DEFAULT_SILENCE_DURATION = 60

# Alert state survives restarts when Home Assistant was down for less than this (Prometheus
# `--rules.alert.for-outage-tolerance` default); older state is dropped
RESTORE_MAX_AGE = 3600
STORAGE_VERSION = 1

# Actions of mobile app notifications
EVENT_MOBILE_APP_ACTION = "mobile_app_notification_action"
ACTION_SILENCE_PREFIX = "PROMDASH_SILENCE_"
EVENT_SILENCE = f"{DOMAIN}_silence"

SERVICE_QUERY = "query"

SEVERITY_OTHER = "other"  # alerts without one of SEVERITIES
NOTIFY_SEVERITIES = [*SEVERITIES, SEVERITY_OTHER]
SOURCE_LOCAL = "local"
SOURCE_PROMETHEUS = "prometheus"
NOTIFY_SOURCES = [SOURCE_LOCAL, SOURCE_PROMETHEUS]
