const path = require("path");
const webpack = require('webpack');

const envKeys = Object.keys(process.env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
  return prev;
}, {});

module.exports = {
  mode: "development",
  // Convert to ES5
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "react",
                "stage-0",
                ["env", { targets: { browsers: ["last 2 versions"] } }],
              ],
            },
          },
          "eslint-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
      },
    ],
  },
  plugins: [new webpack.DefinePlugin(envKeys)],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/client/components/"),
      conf: path.resolve(__dirname, "./src/client/conf/"),
      actions: path.resolve(__dirname, "src/client/store/actions/"),
      reducers: path.resolve(__dirname, "src/client/store/reducers/"),
      talons: path.resolve(__dirname, "src/client/talons/"),
      helper: path.resolve(__dirname, "src/helper/"),
      pages: path.resolve(__dirname, "src/client/pages/"),
      icons: path.resolve(__dirname, "src/client/assets/icons/"),
      store: path.resolve(__dirname, "src/client/store"),
      algolia: path.resolve(__dirname, "src/client/components/Algolia"),
      api: path.resolve(__dirname, "src/client/graphql"),
      ui: path.resolve(__dirname, "src/client/components/UI"),
    },
  },
};
