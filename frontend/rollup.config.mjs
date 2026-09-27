import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';

const dev = process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/prometheus-cards.js',
    format: 'es',
  },
  plugins: [
    nodeResolve(),
    typescript(),
    json(),
    string({
      include: '**/*.css',
    }),
    !dev && terser(),
  ],
};
