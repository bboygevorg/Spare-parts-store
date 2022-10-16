const path = require("path");
const commonConfig = require("./webpack.common");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
// const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

const serverConfig = {
  // We tell webpack that the bundle is for a node server (envirenement)
  target: "node",

  mode: "development",

  // We tell the entry point. From where it should start
  entry: path.resolve(__dirname, "./src/server.js"),

  // Where to put the bundle
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "build"),
  },
  externals: [nodeExternals()],
  node: {
    __dirname: false,
  },
  plugins: [
    // new CleanWebpackPlugin(
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["./*.js"],
    }),
    // ),
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: "body",
    }),
    // new ServiceWorkerWebpackPlugin({
    //   entry: path.join(__dirname, "src/sw.js"),
    // }),
  ],
  // Tell webpack to run babble on the code
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "isomorphic-style-loader",
          },
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
      }
    ],
  },
};

module.exports = merge(commonConfig, serverConfig);
