
const path = require('path');
const commonConfig = require('./webpack.common');
const merge = require('webpack-merge'); 
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
// cleanOnceBeforeBuildPatterns: ["./js/build/*", "./css/build/*"];

const clientConfig = {
  // We tell the entry point. From where it should start
  entry: "./src/client/client.js",

  mode: "development",
  // Where to put the bundle
  output: {
    filename: `bundle.[hash].js`,
    path: path.resolve(__dirname, "public"),
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["./*.js"],
    }),
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: "body",
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, "src/sw.js"),
    })

  ],
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: [
      //     "style-loader",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         modules: {
      //           localIdentName: "[name]-[local]-[hash:base64:3]",
      //         },
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.css$/,
        oneOf: [
          {
            include: /node_modules/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: false,
                },
              },
            ],
          },
          {
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: "[name]-[local]-[hash:base64:3]",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
};

module.exports = merge(commonConfig, clientConfig);
