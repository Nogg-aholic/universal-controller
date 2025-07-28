import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/universal-controller-card.ts',
  output: {
    file: 'dist/universal-controller-card.js',
    format: 'es',
    sourcemap: false, // Disable sourcemap for production
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  // Bundle everything for Home Assistant
  external: [],
};
