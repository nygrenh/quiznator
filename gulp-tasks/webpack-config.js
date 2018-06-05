const path = require('path');
const webpack = require('webpack');

module.exports = options => {
  return {
    entry: options.entry,
    devtool: options.isDevelopment ? 'eval-source-map' : '',
    output: {
      path: options.output,
      filename: `${options.fileName}.min.js`
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.json$/,
          loader: 'json'
        },
        { 
          test: /\.css$/, 
          loader: "style-loader!css-loader" 
        }
      ]
    },
    resolve: {
      modulesDirectories: ['node_modules', ...(options.modules || [])],
      extensions: ['', '.js', '.jsx', 'css']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(options.env || {})
      }),
      options.isDevelopment ? undefined : new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ].filter(p => !!p),
    watch: options.isDevelopment
  };
}
