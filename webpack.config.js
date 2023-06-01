module.exports = [
  {
    mode: 'development',
    entry: './js/site/index.js',
    output: {
      filename: '../dev/community.js',
    },
    externals: {
      site: {root: 'site'},
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {test: /\.tsx?$/, loader: 'ts-loader'},
        {test: /\.js$/, loader: 'source-map-loader'},
      ],
    },
  },
  {
    mode: 'development',
    target: 'web',
    entry: './js/data_handler/index.ts',
    output: {
      library: {
        name: 'DataHandler',
        type: 'umd',
      },
      globalObject: 'this',
      filename: '../dev/data_handler.js',
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
      fallback: {https: false},
    },
    module: {
      rules: [
        {test: /\.tsx?$/, loader: 'ts-loader'},
        {test: /\.js$/, loader: 'source-map-loader'},
      ],
    },
  },
]
