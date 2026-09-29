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
CONDITIONS = [CONDITION_ANY, ">", ">=", "<", "<=", "==", "!="]
SEVERITIES = ["critical", "warning", "info"]

EVENT_ALERT = f"{DOMAIN}_alert"
MAX_ALERT_SERIES_ATTRIBUTE = 50
