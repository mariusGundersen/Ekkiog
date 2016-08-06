var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OfflinePlugin = require('offline-plugin');
var autoprefixer = require('autoprefixer');

var ROOT_PATH = path.resolve(__dirname);
var ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/main.js');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var JS_PATH = path.resolve(ROOT_PATH, 'src/js');
var TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html');
var SHADER_PATH = path.resolve(ROOT_PATH, 'src/shaders');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var FAVICON_PATH = path.resolve(ROOT_PATH, 'src/icons/favicon.ico');

var debug = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: ENTRY_PATH,
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ekkiog',
      template: TEMPLATE_PATH,
      favicon: FAVICON_PATH
    }),
    new webpack.DefinePlugin({
      '__DEV__': debug,
      'NODE_ENV': debug ? '"production"' : '"development"'
    }),
    new OfflinePlugin({
      caches: 'all'
    })
  ],
  resolve: {
    root: [JS_PATH, SRC_PATH]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: JS_PATH,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl'
      },
      {
        test: /\.png$/,
        loader: 'file?name=img/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /manifest\.json$/,
        loader: 'w3c-manifest?name=[name].[hash].[ext]&icon=icons/[name].[hash].[ext]&legacyAppleSupport=true'
      }
    ]
  },
  debug: debug,
  devtool: debug ? 'eval-source-map' : 'source-map',
  postcss: function () {
    return [autoprefixer({ browsers: ['iOS 9', 'last 2 versions'] })];
  }
};
