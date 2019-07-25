const path = require('path');
const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');
const autoprefixer = require('autoprefixer');
const nesting = require('postcss-nesting');
const Visualizer = require('webpack-visualizer-plugin');

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    index: ['./src/js/index.ts']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].[hash].bundle.js',
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true
  },
  mode: debug ? 'development' : 'production',
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': debug,
      'process.env.NODE_ENV': debug ? '"development"' : '"production"',
      '__BuildDate__': JSON.stringify(new Date().toISOString())
    }),
    new Visualizer(),
    ...(debug ? [
    ] : [
        new OfflinePlugin({
          caches: 'all',
          ServiceWorker: {
            events: true
          },
          minify: false,
          externals: [
            '/'
          ]
        })
      ])
  ],
  optimization: {
    namedModules: debug,
    noEmitOnErrors: debug,
    minimize: !debug
  },
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
          'babel-loader',
          'ts-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /react-icons/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react'
          ]
        }
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
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: debug ? '[local]__[path][name]' : '[hash:base64]'
              },
              localsConvention: 'camelCase',
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer(),
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
        type: "javascript/auto",
        options: {
          name: '[name].[hash].[ext]',
          icon: '/icons/[name].[hash].[ext]',
          legacyAppleSupport: true
        }
      }
    ]
  }
};
