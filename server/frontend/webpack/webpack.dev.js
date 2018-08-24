let path = require('path');
let webpack = require('webpack');
let webpackMerge = require('webpack-merge');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let commonConfig = require('./webpack.common.js');
let OpenBrowserPlugin = require('open-browser-webpack-plugin');

process.env.NODE_ENV = 'development';

let config = {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: path.resolve(__dirname, '..', 'dist/'),
    filename: '[name].js',
    publicPath: '',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader'
          },
          {
            loader: 'angular2-template-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [
                  require('postcss-smart-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-cssnext')({ browsers: ['last 2 versions', 'Firefox ESR', 'IE 9'] })
                ];
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css'),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ],

  watchOptions: {
    poll: false,
    ignored: /node_modules/
  },

  devServer: {
    inline: true,
    hot: true
  }
};

if (process.env.OPEN_BROWSER) {
  config.plugins.push(new OpenBrowserPlugin({ url: 'http://localhost:3001' }));
}

module.exports = webpackMerge(commonConfig, config);
