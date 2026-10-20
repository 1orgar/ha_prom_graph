/**
 * Minimal PromQL context detection for autocompletion.
 * Pure functions (no DOM), covered by unit tests.
 */

export const PROMQL_FUNCTIONS = [
  'abs', 'absent', 'absent_over_time', 'avg_over_time', 'ceil', 'changes', 'clamp', 'clamp_max', 'clamp_min',
  'count_over_time', 'day_of_month', 'day_of_week', 'delta', 'deriv', 'exp', 'floor', 'histogram_quantile',
  'holt_winters', 'hour', 'idelta', 'increase', 'irate', 'label_join', 'label_replace', 'last_over_time', 'ln',
  'log2', 'log10', 'max_over_time', 'min_over_time', 'minute', 'month', 'predict_linear', 'quantile_over_time',
  'rate', 'resets', 'round', 'scalar', 'sort', 'sort_desc', 'sqrt', 'stddev_over_time', 'sum_over_time', 'time',
  'timestamp', 'vector', 'year'
];

export const PROMQL_AGGREGATIONS = [
  'sum', 'avg', 'min', 'max', 'count', 'count_values', 'group', 'stddev', 'stdvar', 'topk', 'bottomk', 'quantile'
];

export const PROMQL_KEYWORDS = ['by', 'without', 'on', 'ignoring', 'group_left', 'group_right', 'offset', 'bool', 'and', 'or', 'unless'];

export type CompletionContext =
  | { kind: 'metric'; prefix: string; from: number }
  | { kind: 'label'; prefix: string; from: number; metric?: string }
  | { kind: 'label_value'; prefix: string; from: number; label: string; metric?: string }
  | { kind: 'none' };

/** Metric name right before the `{` that encloses `pos` (if any). */
function metricBefore(text: string, bracePos: number): string | undefined {
  const m = text.slice(0, bracePos).match(/([a-zA-Z_:][a-zA-Z0-9_:]*)\s*$/);
  if (!m) return undefined;
  const name = m[1];
  if (PROMQL_AGGREGATIONS.includes(name) || PROMQL_FUNCTIONS.includes(name) || PROMQL_KEYWORDS.includes(name)) {
    return undefined;
  }
  return name;
}

/** Determine what should be completed at cursor position `pos`. */
export function completionContext(text: string, pos: number): CompletionContext {
  const before = text.slice(0, pos);

  // inside a string literal -> label value?  e.g. job="no|
  const valueMatch = before.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*(=~|!~|=|!=)\s*"([^"]*)$/);
  if (valueMatch) {
    const brace = before.lastIndexOf('{');
    return {
      kind: 'label_value',
      label: valueMatch[1],
      prefix: valueMatch[3],
      from: pos - valueMatch[3].length,
      metric: brace >= 0 ? metricBefore(text, brace) : undefined
    };
  }

  // inside {...} or by(...)/without(...) -> label name
  const openBrace = before.lastIndexOf('{');
  const closeBrace = before.lastIndexOf('}');
  const groupMatch = before.match(/\b(by|without|on|ignoring|group_left|group_right)\s*\(([^()]*)$/);
  const inBraces = openBrace > closeBrace;
  if (inBraces || groupMatch) {
    const word = before.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/);
    const prefix = word ? word[1] : '';
    // label position only right after `{`, `,` or `(` (not after an operator)
    const head = before.slice(0, pos - prefix.length).trimEnd();
    if (head.endsWith('{') || head.endsWith(',') || head.endsWith('(')) {
      return {
        kind: 'label',
        prefix,
        from: pos - prefix.length,
        metric: inBraces ? metricBefore(text, openBrace) : undefined
      };
    }
    return { kind: 'none' };
  }

  // otherwise: metric / function name
  const word = before.match(/([a-zA-Z_:][a-zA-Z0-9_:]*)$/);
  if (word) {
    // not a duration like [5m] or a number
    const charBefore = before[pos - word[1].length - 1];
    if (charBefore === '[' || /[0-9]/.test(word[1][0])) return { kind: 'none' };
    return { kind: 'metric', prefix: word[1], from: pos - word[1].length };
  }
  return { kind: 'none' };
}

export interface Suggestion {
  value: string;
  kind: 'metric' | 'function' | 'aggregation' | 'keyword' | 'label' | 'value';
  detail?: string;
}

/** Filter + rank candidates: prefix matches first, then substring matches. */
export function rankSuggestions(prefix: string, candidates: Suggestion[], limit = 50): Suggestion[] {
  const p = prefix.toLowerCase();
  const starts: Suggestion[] = [];
  const contains: Suggestion[] = [];
  for (const c of candidates) {
    const v = c.value.toLowerCase();
    if (!p || v.startsWith(p)) starts.push(c);
    else if (p.length >= 2 && v.includes(p)) contains.push(c);
  }
  return [...starts, ...contains].filter((s) => s.value !== prefix).slice(0, limit);
}

/** Apply a suggestion: returns new text and cursor position. */
export function applySuggestion(
  text: string,
  pos: number,
  ctx: Exclude<CompletionContext, { kind: 'none' }>,
  s: Suggestion
): { text: string; cursor: number } {
  let insert = s.value;
  let after = text.slice(pos);
  // replace the rest of the current word too
  const tail = after.match(/^[a-zA-Z0-9_:]*/);
  if (tail && ctx.kind !== 'label_value') after = after.slice(tail[0].length);
  if (ctx.kind === 'label_value') {
    // replace the rest of the value up to the closing quote (if there is one before `}`/`,`)
    const rest = after.match(/^[^"},]*/);
    if (rest) after = after.slice(rest[0].length);
    if (!after.startsWith('"')) insert += '"';
  } else if (s.kind === 'function' || s.kind === 'aggregation') {
    insert += '(';
  } else if (ctx.kind === 'label' && !/^\s*(=|!=|=~|!~)/.test(after)) {
    const inGroup = /\b(by|without|on|ignoring|group_left|group_right)\s*\([^()]*$/.test(text.slice(0, ctx.from));
    if (!inGroup) insert += '="';
  }
  const newText = text.slice(0, ctx.from) + insert + after;
  // for label values the cursor goes after the closing quote
  const cursor = ctx.from + insert.length + (ctx.kind === 'label_value' && !insert.endsWith('"') ? 1 : 0);
  return { text: newText, cursor };
}
