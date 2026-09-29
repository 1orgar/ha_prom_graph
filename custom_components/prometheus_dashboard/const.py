"""Constants for the Prometheus Dashboard integration."""

DOMAIN = "prometheus_dashboard"
CONF_PROMETHEUS_URL = "prometheus_url"
CONF_NAME = "name"
CONF_USERNAME = "username"
CONF_PASSWORD = "password"
CONF_VERIFY_SSL = "verify_ssl"

DEFAULT_NAME = "Prometheus"
REQUEST_TIMEOUT = 15
TEST_TIMEOUT = 10

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

EVENT_ALERT = f"{DOMAIN}_alert"
MAX_ALERT_SERIES_ATTRIBUTE = 50

# Notifications of firing alerts (options of the server)
CONF_NOTIFY_PERSISTENT = "notify_persistent"      # system notifications (sidebar), default true
CONF_NOTIFY_SERVICES = "notify_services"          # notify.* services for push, e.g. mobile_app_phone
CONF_NOTIFY_SEVERITIES = "notify_severities"      # severities sent as push
CONF_NOTIFY_SOURCES = "notify_sources"            # local (Home Assistant rules) / prometheus (server rules)
CONF_NOTIFY_CRITICAL = "notify_critical"          # critical severity -> critical push (iOS) / alarm stream (Android)
CONF_NOTIFY_RESOLVED = "notify_resolved"          # push when an alert is resolved, default true

SEVERITY_OTHER = "other"  # alerts without one of SEVERITIES
NOTIFY_SEVERITIES = [*SEVERITIES, SEVERITY_OTHER]
SOURCE_LOCAL = "local"
SOURCE_PROMETHEUS = "prometheus"
NOTIFY_SOURCES = [SOURCE_LOCAL, SOURCE_PROMETHEUS]
