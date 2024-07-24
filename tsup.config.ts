import { defineConfig } from 'tsup';

import type { Options } from 'tsup';

const common: Options = {
  clean: true,
  target: 'es2015',
  splitting: false,
  sourcemap: true,
  dts: true,
};

export default defineConfig([
  {
    ...common,
    name: 'main::esm',
    entry: ['src/index.ts'],
    outDir: 'dist/esm',
    format: 'esm',
  },
  {
    ...common,
    name: 'main::cjs',
    entry: ['src/index.ts'],
    outDir: 'dist/cjs',
    format: 'cjs',
  },
]);
