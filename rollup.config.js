import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import pkg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: 'src/index.ts',
    output: [
        {
            // name: 'MyPlugin',
            dir: 'dist',
            format: 'amd',
            globals: {
                react: 'React',
            },
        },
    ],
    external: ['react', '@capture-models/helpers', 'react-router-dom'],
    plugins: [
        typescript({ target: 'es5' }),
        resolve({ browser: true }), // so Rollup can find `ms`
        replace({
            'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
            'process.env.VERSION': JSON.stringify(pkg.version),
        }),
        // commonjs({ extensions: ['.js', '.ts', '.tsx'] }), // the ".ts" extension is required
        // isProduction && terser(),
        // isProduction && compiler(),
    ].filter(Boolean),
};
