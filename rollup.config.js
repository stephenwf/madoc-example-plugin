import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
  ],
  external: ['react'],
  plugins: [
    typescript({ target: 'es5' }),
    resolve({ browser: true }), // so Rollup can find `ms`
    isProduction && compiler(),
  ].filter(Boolean),
};
