import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const commonConfig = {
  input: 'src/index.js',
  external: ['react'],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs({
      ignoreGlobal: true,
    }),
  ],
};

export default [
  {
    ...commonConfig,
    output: {
      dir: 'lib/cjs',
      format: 'cjs',
      exports: 'default',
    },
  },
  {
    ...commonConfig,
    output: {
      dir: 'lib/esm',
      format: 'esm',
    },
  },
];
