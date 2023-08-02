import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'

export default [
  {
    input: 'js/site/index.ts',
    output: {
      name: 'Community',
      file: 'dev/community.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [typescript({inlineSources: true}), serve({contentBase: 'dev', port: 8000})],
  },
  {
    input: 'js/data_handler/index.ts',
    output: {
      name: 'DataHandler',
      file: 'dev/data_handler.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [typescript({inlineSources: true})],
  },
]
