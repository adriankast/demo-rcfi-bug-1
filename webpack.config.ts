/* eslint-disable import/no-extraneous-dependencies */

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import * as fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";

const currentTask = process.env.npm_lifecycle_event;

const pages = fs
  .readdirSync("./public")
  .filter((file) => file.endsWith(".html"))
  .map(
    (page) =>
      new HtmlWebpackPlugin({
        filename: page,
        template: `./public/${page}`,
      })
  );

const config: webpack.Configuration = {
  entry: "./src/index.tsx",
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },

  plugins: pages,
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};

if (currentTask === "client") {
  config.output = {
    filename: "bundled.js",
    publicPath: "/",
  };
  config.devServer = {
    hot: true,
    port: 3000,
    host: "localhost",
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    },
  };
  config.mode = "development";
  config.plugins = [
    ...(config.plugins ?? []),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
  ];
}

if (currentTask === "build") {
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  };
  config.mode = "production";
  config.optimization = {
    splitChunks: { chunks: "all" },
  };
  config.plugins = [
    ...(config.plugins ?? []),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
    }),
  ];
}

module.exports = config;
