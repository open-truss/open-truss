/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [defaultLoaders.babel],
          },
        ],
      },
    };
  },
};
