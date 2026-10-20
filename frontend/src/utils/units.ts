/**
 * Grafana-like unit registry. Each unit knows how to scale a value within its
 * dimension (bytes -> KiB -> MiB, W -> kW, s -> min -> hour ...).
 * Unit ids follow Grafana where possible, so dashboards are easy to port.
 */

export interface FormattedValue {
  prefix: string;
  text: string;
  suffix: string;
}

export type Formatter = (value: number, decimals?: number) => FormattedValue;

export interface UnitDef {
  id: string;
  label: string;
  category: string;
  fn: Formatter;
}

// ---- number helpers --------------------------------------------------------

/** ~3 significant digits when decimals are not set explicitly. */
export function toFixed(value: number, decimals?: number): string {
  if (!Number.isFinite(value)) return String(value);
  if (decimals === undefined || decimals === null || Number.isNaN(decimals)) {
    const abs = Math.abs(value);
    const auto = abs === 0 ? 0 : Math.min(6, Math.max(0, 2 - Math.floor(Math.log10(abs))));
    return String(parseFloat(value.toFixed(auto)));
  }
  return value.toFixed(Math.max(0, Math.min(10, decimals)));
}

const out = (text: string, suffix = '', prefix = ''): FormattedValue => ({ prefix, text, suffix });

/** Scales by `factor`; exts[offset] is the unit the raw value is expressed in. */
function scaled(factor: number, exts: string[], offset = 0, prefix = ''): Formatter {
  return (v, d) => {
    if (v === 0 || !Number.isFinite(v)) return out(toFixed(v, d), exts[offset], prefix);
    let idx = Math.floor(Math.log(Math.abs(v)) / Math.log(factor));
    idx = Math.max(-offset, Math.min(exts.length - 1 - offset, idx));
    return out(toFixed(v / Math.pow(factor, idx), d), exts[idx + offset], prefix);
  };
}

const SI_PREFIXES = ['p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E'];

function si(base: string, start = ''): Formatter {
  return scaled(1000, SI_PREFIXES.map((p) => ` ${p}${base}`), SI_PREFIXES.indexOf(start));
}

function fixed(suffix: string): Formatter {
  return (v, d) => out(toFixed(v, d), suffix);
}

function binary(exts: string[], offset = 0): Formatter {
  return scaled(1024, exts.map((e) => ` ${e}`), offset);
}

function decimal(exts: string[], offset = 0): Formatter {
  return scaled(1000, exts.map((e) => ` ${e}`), offset);
}

function count(symbol: string): Formatter {
  return scaled(1000, ['', 'K', 'M', 'B', 'T'].map((p) => ` ${p}${symbol}`));
}

function currency(symbol: string, after = false): Formatter {
  const short = scaled(1000, ['', 'K', 'M', 'B', 'T']);
  return (v, d) => {
    const r = short(v, d);
    return after ? out(r.text, `${r.suffix} ${symbol}`) : out(r.text, r.suffix, symbol);
  };
}

const TIME_STEPS: [string, number][] = [
  [' ns', 1e-9],
  [' µs', 1e-6],
  [' ms', 1e-3],
  [' s', 1],
  [' min', 60],
  [' hour', 3600],
  [' day', 86400],
  [' week', 604800],
  [' year', 31536000]
];

/** Time value expressed in unit with `factor` seconds, scaled to the best unit. */
function time(factor: number): Formatter {
  return (v, d) => {
    const secs = v * factor;
    const abs = Math.abs(secs);
    let step = TIME_STEPS.find(([, f]) => f === factor) || TIME_STEPS[3];
    if (abs > 0) {
      for (const candidate of TIME_STEPS) {
        if (abs >= candidate[1]) step = candidate;
      }
      if (abs < TIME_STEPS[0][1]) step = TIME_STEPS[0];
    }
    return out(toFixed(secs / step[1], d), step[0]);
  };
}

const DURATION_PARTS: [string, number][] = [
  ['y', 31536000],
  ['w', 604800],
  ['d', 86400],
  ['h', 3600],
  ['m', 60],
  ['s', 1]
];

/** Human readable duration, e.g. "2d 3h 15m". Input in seconds * factor. */
function duration(factor: number): Formatter {
  return (v) => {
    let secs = Math.abs(v * factor);
    const sign = v < 0 ? '-' : '';
    if (secs < 1) return out(`${sign}${Math.round(secs * 1000)}ms`);
    const parts: string[] = [];
    for (const [name, size] of DURATION_PARTS) {
      if (secs >= size || (parts.length && parts.length < 3)) {
        const n = Math.floor(secs / size);
        secs -= n * size;
        if (n > 0) parts.push(`${n}${name}`);
      }
      if (parts.length >= 3) break;
    }
    return out(sign + (parts.join(' ') || '0s'));
  };
}

function dateTime(kind: 'local' | 'iso' | 'fromNow'): Formatter {
  return (v) => {
    // Prometheus timestamps are seconds; treat big numbers as milliseconds
    const ms = Math.abs(v) < 1e11 ? v * 1000 : v;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return out(String(v));
    if (kind === 'iso') return out(date.toISOString());
    if (kind === 'local') return out(date.toLocaleString());
    const diff = (ms - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    const abs = Math.abs(diff);
    const [unit, size]: [Intl.RelativeTimeFormatUnit, number] =
      abs < 60 ? ['second', 1] : abs < 3600 ? ['minute', 60] : abs < 86400 ? ['hour', 3600]
        : abs < 2592000 ? ['day', 86400] : abs < 31536000 ? ['month', 2592000] : ['year', 31536000];
    return out(rtf.format(Math.round(diff / size), unit));
  };
}

function bool(t: string, f: string): Formatter {
  return (v) => out(v ? t : f);
}

// ---- registry --------------------------------------------------------------

type Group = [category: string, units: [id: string, label: string, fn: Formatter][]];

const GROUPS: Group[] = [
  ['Misc', [
    ['none', 'Number', (v, d) => out(toFixed(v, d))],
    ['short', 'Short (K, M, B)', scaled(1000, ['', ' K', ' Mil', ' Bil', ' Tri'])],
    ['sci', 'Scientific notation', (v, d) => out(v.toExponential(d ?? 2))],
    ['percent', 'Percent (0-100)', fixed('%')],
    ['percentunit', 'Percent (0.0-1.0)', (v, d) => out(toFixed(v * 100, d), '%')],
    ['humidity', 'Humidity (%H)', fixed('%H')],
    ['dB', 'Decibel', fixed(' dB')],
    ['ppm', 'Parts-per-million (ppm)', fixed(' ppm')],
    ['bool_yes_no', 'Yes / No', bool('Yes', 'No')],
    ['bool_on_off', 'On / Off', bool('On', 'Off')],
    ['bool', 'True / False', bool('True', 'False')]
  ]],
  ['Data', [
    ['bytes', 'bytes (IEC)', binary(['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'])],
    ['decbytes', 'bytes (SI)', decimal(['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB'])],
    ['bits', 'bits (IEC)', binary(['b', 'Kib', 'Mib', 'Gib', 'Tib', 'Pib'])],
    ['decbits', 'bits (SI)', decimal(['b', 'kb', 'Mb', 'Gb', 'Tb', 'Pb'])],
    ['kbytes', 'kibibytes', binary(['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'], 1)],
    ['mbytes', 'mebibytes', binary(['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'], 2)],
    ['gbytes', 'gibibytes', binary(['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'], 3)]
  ]],
  ['Data rate', [
    ['binBps', 'bytes/sec (IEC)', binary(['B/s', 'KiB/s', 'MiB/s', 'GiB/s', 'TiB/s'])],
    ['Bps', 'bytes/sec (SI)', decimal(['B/s', 'kB/s', 'MB/s', 'GB/s', 'TB/s'])],
    ['binbps', 'bits/sec (IEC)', binary(['b/s', 'Kib/s', 'Mib/s', 'Gib/s', 'Tib/s'])],
    ['bps', 'bits/sec (SI)', decimal(['b/s', 'kb/s', 'Mb/s', 'Gb/s', 'Tb/s'])],
    ['KiBs', 'kibibytes/sec', binary(['B/s', 'KiB/s', 'MiB/s', 'GiB/s', 'TiB/s'], 1)],
    ['MiBs', 'mebibytes/sec', binary(['B/s', 'KiB/s', 'MiB/s', 'GiB/s', 'TiB/s'], 2)],
    ['pps', 'packets/sec', decimal(['p/s', 'kp/s', 'Mp/s', 'Gp/s'])]
  ]],
  ['Throughput', [
    ['ops', 'ops/sec (ops)', count('ops')],
    ['reqps', 'requests/sec (rps)', count('req/s')],
    ['rps', 'reads/sec (rps)', count('rd/s')],
    ['wps', 'writes/sec (wps)', count('wr/s')],
    ['iops', 'I/O ops/sec (iops)', count('io/s')],
    ['opm', 'ops/min (opm)', count('ops/min')],
    ['eps', 'events/sec', count('evt/s')]
  ]],
  ['Time', [
    ['ns', 'nanoseconds (ns)', time(1e-9)],
    ['µs', 'microseconds (µs)', time(1e-6)],
    ['ms', 'milliseconds (ms)', time(1e-3)],
    ['s', 'seconds (s)', time(1)],
    ['m', 'minutes (m)', time(60)],
    ['h', 'hours (h)', time(3600)],
    ['d', 'days (d)', time(86400)],
    ['dtdurations', 'duration (s)', duration(1)],
    ['dtdurationms', 'duration (ms)', duration(1e-3)],
    ['hertz', 'Hertz (1/s)', si('Hz')]
  ]],
  ['Date & time', [
    ['dateTimeAsLocal', 'Local date/time', dateTime('local')],
    ['dateTimeAsIso', 'ISO 8601', dateTime('iso')],
    ['dateTimeFromNow', 'From now', dateTime('fromNow')]
  ]],
  ['Energy', [
    ['watt', 'Watt (W)', si('W')],
    ['kwatt', 'Kilowatt (kW)', si('W', 'k')],
    ['voltamp', 'Volt-ampere (VA)', si('VA')],
    ['watth', 'Watt-hour (Wh)', si('Wh')],
    ['kwatth', 'Kilowatt-hour (kWh)', si('Wh', 'k')],
    ['joule', 'Joule (J)', si('J')],
    ['volt', 'Volt (V)', si('V')],
    ['mvolt', 'Millivolt (mV)', si('V', 'm')],
    ['amp', 'Ampere (A)', si('A')],
    ['mamp', 'Milliampere (mA)', si('A', 'm')],
    ['ohm', 'Ohm (Ω)', si('Ω')]
  ]],
  ['Temperature', [
    ['celsius', 'Celsius (°C)', fixed('°C')],
    ['fahrenheit', 'Fahrenheit (°F)', fixed('°F')],
    ['kelvin', 'Kelvin (K)', fixed(' K')]
  ]],
  ['Pressure', [
    ['pressurembar', 'Millibars', si('bar', 'm')],
    ['pressurebar', 'Bars', si('bar')],
    ['pressurehpa', 'Hectopascals', fixed(' hPa')],
    ['pressurekpa', 'Kilopascals', fixed(' kPa')],
    ['pressurepsi', 'PSI', fixed(' psi')]
  ]],
  ['Length & area', [
    ['lengthmm', 'millimeter (mm)', si('m', 'm')],
    ['lengthm', 'meter (m)', si('m')],
    ['lengthkm', 'kilometer (km)', si('m', 'k')],
    ['areaM2', 'Square meters (m²)', fixed(' m²')]
  ]],
  ['Mass & volume', [
    ['massmg', 'milligram (mg)', si('g', 'm')],
    ['massg', 'gram (g)', si('g')],
    ['masskg', 'kilogram (kg)', si('g', 'k')],
    ['mlitre', 'millilitre (mL)', si('L', 'm')],
    ['litre', 'litre (L)', si('L')],
    ['m3', 'cubic meter (m³)', fixed(' m³')]
  ]],
  ['Velocity & flow', [
    ['velocityms', 'meters/second (m/s)', fixed(' m/s')],
    ['velocitykmh', 'kilometers/hour (km/h)', fixed(' km/h')],
    ['flowlpm', 'Litre/min (L/min)', fixed(' L/min')],
    ['flowcms', 'Cubic meter/sec (m³/s)', fixed(' m³/s')]
  ]],
  ['Currency', [
    ['currencyUSD', 'Dollars ($)', currency('$')],
    ['currencyEUR', 'Euro (€)', currency('€')],
    ['currencyRUB', 'Rubles (₽)', currency('₽', true)]
  ]]
];

export const UNITS: UnitDef[] = GROUPS.flatMap(([category, units]) =>
  units.map(([id, label, fn]) => ({ id, label, category, fn }))
);

