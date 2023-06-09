const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  configureWebpack: {
    entry: './src/main.js',
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Chatr';
      return args;
    });
  },
  devServer:
    process.env.NODE_ENV !== 'production'
      ? {
          historyApiFallback: true,
          server: {
            type: 'http',
          },
          client: {
            webSocketURL: `auto://0.0.0.0:0/ws`,
          },
        }
      : undefined,
});
