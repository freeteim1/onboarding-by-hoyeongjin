// babel.config.cjs
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: 'last 1 Chrome version', modules: false }],
    ['@babel/preset-typescript', {}],
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
      ],
    },
  },
};
