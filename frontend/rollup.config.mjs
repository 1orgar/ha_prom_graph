import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import { readFileSync } from 'node:fs';

const dev = process.env.ROLLUP_WATCH;
// one version for the integration and the cards: the one in manifest.json
const manifest = JSON.parse(
  readFileSync(new URL('../custom_components/prometheus_dashboard/manifest.json', import.meta.url), 'utf8')
);

// Replaces the __VERSION__ identifier with the integration version
const version = () => ({
  name: 'inject-version',
  transform(code, id) {
    if (!id.endsWith('.ts') || !code.includes('__VERSION__')) return null;
    return { code: code.replace(/__VERSION__/g, JSON.stringify(manifest.version)), map: null };
  },
});

export default {
  input: 'src/index.ts',
  output: {
    // shipped with the integration and served from its static path (see cards.py)
    file: '../custom_components/prometheus_dashboard/www/prometheus-dashboard-cards.js',
    format: 'es',
    inlineDynamicImports: true,
  },
  plugins: [
    nodeResolve(),
    version(),
    typescript({ sourceMap: false, inlineSources: false }),
    json(),
    string({
      include: '**/*.css',
    }),
    !dev && terser({ format: { comments: false } }),
  ],
};
