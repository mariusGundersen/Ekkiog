const path = require('path');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const OfflinePlugin = require('offline-plugin');
const autoprefixer = require('autoprefixer');
const nesting = require('postcss-nesting');
const BabelMinifyPlugin = require("babel-minify-webpack-plugin");

const debug = process.env.NODE_ENV !== 'production';

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,

    presets: [
      ["env", {
        spec: true,
        modules: false,
        targets : {
          ios: 10,
          chrome: 58,
          firefox: 53
        }
      }],
      "es2016",
      "es2017",
      "react"
    ],
    plugins: [
      ["transform-runtime", {
        polyfill: false,
        regenerator: false
      }],
      "transform-class-properties",
      "transform-object-rest-spread"
    ]
  }
};

module.exports = {
  entry: {
    index: './src/js/index.ts'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': debug,
      'process.env.NODE_ENV': debug ? '"development"' : '"production"',
      '__BuildDate__': JSON.stringify(new Date().toISOString())
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: debug
    }),
    ...(debug ? [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new DashboardPlugin()
    ] : [
      new OfflinePlugin({
        caches: 'all',
        ServiceWorker: {
          events: true
        }
      }),
      new BabelMinifyPlugin()
    ])
  ],
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  devtool: debug && 'eval-source-map',
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
        loader: 'url-loader'
      },
      {
        test: /\.ico$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader:'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '_[local]-[hash:base64:16]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () =>  [
                autoprefixer({ browsers: ['iOS 9', 'last 2 versions'] }),
                nesting()
              ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
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
