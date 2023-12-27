const webpack = require("webpack");


module.exports = {
  webpack: {
    configure: webpackConfig => {
      // const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
      //   ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      // );

      // webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      webpackConfig['resolve'] = {
        fallback: {
          process: require.resolve("process/browser"),
          zlib: require.resolve("browserify-zlib"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util"),
          buffer: require.resolve("buffer"),
          asset: require.resolve("assert"),
          path: require.resolve("path-browserify"),
          os: require.resolve("os-browserify/browser"),
          crypto: require.resolve("crypto-browserify"),
          timers: require.resolve("timers-browserify"),
          http: require.resolve("stream-http"),
          fs: require.resolve('browserify-fs'),
          dns: require.resolve('@i2labs/dns'),
          net: require.resolve('net-browserify'),
          tls: require.resolve('tls-browserify'),
        },
      }
      return webpackConfig;
    },
  },
};
