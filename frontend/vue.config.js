const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  configureWebpack: {
    entry: './src/main.js',
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Speakr';
      return args;
    });
  },
  devServer: {
    historyApiFallback: true,
  },
});
