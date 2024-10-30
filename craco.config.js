const { CracoRemoteComponentsPlugin } = require('@kne/modules-dev');
const aliasConfig = require('./webstorm.webpack.config');
const { getLoader } = require('@craco/craco');
process.env.CI = false;

module.exports = {
  webpack: {
    alias: aliasConfig.resolve.alias, configure: (webpackConfig) => {
      (() => {
        webpackConfig.module.rules.push({
          test: /\.html$/, loader: require.resolve('raw-loader')
        });

        const { isFound, match } = getLoader(webpackConfig, (loader) => {
          return loader.type === 'asset/resource';
        });

        if (!isFound) {
          return;
        }

        if (!match.loader.exclude) {
          match.loader.exclude = [];
        }

        match.loader.exclude.push(/\.html$/);
      })();

      const definePlugin = webpackConfig.plugins.find((plugin) => plugin.constructor.name === 'DefinePlugin');
      Object.assign(definePlugin.definitions['process.env'], {
        DEFAULT_VERSION: `"${process.env.npm_package_version}"`
      });
      return webpackConfig;
    }
  }, plugins: [{
    plugin: CracoRemoteComponentsPlugin
  }]
};
