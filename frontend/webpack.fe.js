const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, '../dist/fe'),
  },
  devServer: {
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    static: 'frontend/public',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') }),
    new CopyPlugin({ patterns: [path.resolve(__dirname, 'public')] }),
  ],
};
