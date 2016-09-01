const path = require('path');
const webpack = require('webpack');

module.exports = options => {
  const opts = Object.assign({ env: { NODE_ENV: 'development' }, modulesDirectories: [], react: false }, options);

  const presets = opts.react === true
    ? ['es2015', 'react']
    : ['es2015'];

  return {
    entry: opts.entry,
    devtool: opts.env.NODE_ENV === 'development' ? 'eval-source-map' : '',
    output: { path: opts.output, filename: opts.fileName },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets
          }
        }
      ]
    },
    resolve: {
      modulesDirectories: ['node_modules', ...opts.modulesDirectories]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(opts.env)
      })
    ],
    watch: opts.env.NODE_ENV === 'development' ? true : false
  };
}
