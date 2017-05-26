const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const OfflinePlugin = require('offline-plugin');
const autoprefixer = require('autoprefixer');
const nesting = require('postcss-nesting');
const BabiliPlugin = require("babili-webpack-plugin");

const debug = process.env.NODE_ENV !== 'production';

const babelLoader = {
  loader: 'babel-loader',
  query: {
    cacheDirectory: true
  }
};

const cssModuleLoader = {
  loader:'css-loader',
  options: {
    modules: true,
    camelCase: true,
    localIdentName: '_[local]-[hash:base64:16]'
  }
};

const cssLoader = {
  loader:'css-loader'
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: function () {
      return [
        autoprefixer({ browsers: ['iOS 9', 'last 2 versions'] }),
        nesting()
      ];
    }
  }
};

module.exports = {
  entry: './src/js/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ekkiog',
      template: './src/index.html',
      favicon: './src/icons/favicon.ico'
    }),
    new webpack.DefinePlugin({
      '__DEV__': debug,
      'process.env.NODE_ENV': debug ? '"development"' : '"production"',
      '__BuildDate__': JSON.stringify(new Date().toISOString())
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
    ...(debug ? [
      new DashboardPlugin()
    ] : [
      new BabiliPlugin()
    ])
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
        test: /\.tsx?$|\.js$/,
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
        test: /react-icons/,
        loader: babelLoader
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
        test: /\.s?css$/,
        use: [
          'style-loader',
          cssModuleLoader,
          postCssLoader
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          cssLoader
        ],
        include: /node_modules/
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
