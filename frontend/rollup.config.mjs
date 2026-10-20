import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import { readFileSync } from 'node:fs';

const dev = process.env.ROLLUP_WATCH;
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// Replaces the __VERSION__ identifier with the package version
const version = () => ({
  name: 'inject-version',
  transform(code, id) {
    if (!id.endsWith('.ts') || !code.includes('__VERSION__')) return null;
    return { code: code.replace(/__VERSION__/g, JSON.stringify(pkg.version)), map: null };
  },
});

export default {
  input: 'src/index.ts',
  output: {
    // HACS requires a .js file named after the repository in dist/
    file: 'dist/ha_prom_graph_cards.js',
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
