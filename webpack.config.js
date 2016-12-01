var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var OfflinePlugin = require('offline-plugin');
var autoprefixer = require('autoprefixer');

var ROOT_PATH = path.resolve(__dirname);
var ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/main.js');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var JS_PATH = path.resolve(ROOT_PATH, 'src/js');
var BUDDY_PATH = path.resolve(ROOT_PATH, 'node_modules/buddy-tree');
var ENNEA_PATH = path.resolve(ROOT_PATH, 'node_modules/ennea-tree');
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
      'process.env.NODE_ENV': debug ? '"development"' : '"production"'
    }),
    new OfflinePlugin({
      caches: 'all',
      ServiceWorker: {
        events: true
      }
    })
  ].concat(debug ? [new DashboardPlugin()] : []),
  resolve: {
    root: [SRC_PATH]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [JS_PATH, ENNEA_PATH, BUDDY_PATH],
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
