// const path = require('path');
const merge = require('webpack-merge');
const devConfig = require('./webpack.client.dev');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  optimization: {
    minimize: true,
    namedModules: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          ecma: 8,
          parse: {
            ecma: 8,
          },
          compress: {
            drop_console: true,
          },
          output: {
            ecma: 7,
            semicolons: false,
          },
          keep_fnames: true,
        },
      }),
    ],
  },
};

module.exports = merge(devConfig, config);