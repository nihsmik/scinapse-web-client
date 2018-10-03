const path = require("path");
const webpack = require("webpack");
const originalWebpackConfig = require("./webpack.dev.browser.config");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const browserSpecificSetting = {
  mode: "production",
  output: {
    ...originalWebpackConfig.output,
    chunkFilename: "[name].bundle.js",
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin()],
    // splitChunks: {
    //   chunks: "all",
    // },
  },
  devtool: false,
  plugins: [
    // new BundleAnalyzerPlugin(),
    new LodashModuleReplacementPlugin(),
  ],
};

const webpackOptionsForBrowser = { ...originalWebpackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
