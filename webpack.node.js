"use strict";

const webpack = require("webpack");
const baseConfig = require("./webpack.base.js");

module.exports = {
  ...baseConfig,
  target: "node",
  node: { __dirname: false },
  entry: "./src/node/main",
  output: {
    filename: "dist/index.js"
  }
};
