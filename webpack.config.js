const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const OfflinePlugin = require('offline-plugin');
const autoprefixer = require('autoprefixer');

const debug = process.env.NODE_ENV !== 'production';

const babelLoader = {
  loader: 'babel-loader',
  query: {
    cacheDirectory: true
  }
};

const cssLoader = {
  loader:'css-loader',
  options: {
    modules: true,
    camelCase: true
  }
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: function () {
      return [
        autoprefixer({ browsers: ['iOS 9', 'last 2 versions'] })
      ];
    }
  }
};

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
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
    }),
    ...(debug ? [new DashboardPlugin()] : [])
  ],
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  devtool: debug ? 'eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader",
        include: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: [
          babelLoader,
          'ts-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          babelLoader
        ]
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
          cssLoader,
          postCssLoader
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
  }
};
