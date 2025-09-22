// jest.config.js (ESM)
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js)$': [
      'babel-jest',
      {
        babelrc: false,
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-typescript', {}],
        ],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};
