var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var OfflinePlugin = require('offline-plugin');
var autoprefixer = require('autoprefixer');

var ROOT_PATH = path.resolve(__dirname);
var BUDDY_PATH = path.resolve(ROOT_PATH, 'node_modules/buddy-tree');
var ENNEA_PATH = path.resolve(ROOT_PATH, 'node_modules/ennea-tree');

var debug = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ekkiog',
      template: './src/index.html',
      favicon: './src/icons/favicon.ico'
    }),
    new webpack.DefinePlugin({
      '__DEV__': debug,
      'process.env.NODE_ENV': debug ? '"development"' : '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: !debug,
      debug: debug
    }),
    new OfflinePlugin({
      caches: 'all',
      ServiceWorker: {
        events: true
      }
    })
  ].concat(debug ? [new DashboardPlugin()] : []),
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src/js'), BUDDY_PATH, ENNEA_PATH],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[hash].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules=true',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  autoprefixer({ browsers: ['iOS 9', 'last 2 versions'] })
                ];
              }
            }
          }
        ]
      },
      {
        test: /manifest\.json$/,
        loader: 'w3c-manifest-loader',
        options: {
          name: '[name].[hash].[ext]',
          icon: 'icons/[name].[hash].[ext]',
          legacyAppleSupport: true
        }
      }
    ]
  },
  devtool: debug ? 'eval-source-map' : 'source-map'
};
