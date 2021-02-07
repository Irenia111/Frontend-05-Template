const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  entry:"./src/main.js",
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};

module.exports = config;