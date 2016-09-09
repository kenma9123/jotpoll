var path = require('path');
var pkg = require('../package.json');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    bundle: path.join(__dirname, '../src/index.js'),
    // vendors: Object.keys(pkg.dependencies)
    vendors: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'moment',
      'lodash'
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      '__DEVELOPMENT__': false,
    }),
    new ExtractTextPlugin('bundle.css', {
        allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      sourceMap: false,
      output: {comments: false}
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity)
  ],
  output: {
    path: path.join(__dirname, '../static/'),
    filename: '[name].js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'src'],
    alias: {

    }
  },
  module: {
    // preLoaders: [
    //   { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ }
    // ],
    loaders: [
      {test: /\.js$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
      {test: /\.css?$/, loaders: ['style', 'raw']},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass')},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff2'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.otf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-otf'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/, loader: "file?name=[name].[ext]"},
      {test: /\.json$/, loader: 'json-loader' }
    ]
  },
  eslint: {
    failOnError: false
  }
};