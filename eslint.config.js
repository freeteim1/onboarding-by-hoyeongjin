// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'Base global rules',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      import: pluginImport,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    name: 'ts-typechecked-only',
    files: ['src/**/*.ts', 'src/**/*.tsx', 'stories/**/*.ts', 'stories/**/*.tsx', 'e2e/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': ['off'],
    },
  },
  {
    name: 'ignores',
    ignores: [
      'node_modules/',
      'dist/',
      'e2e/',
      '**/*.test.*',
      'eslint.config.*',
      'babel.config.*',
      'webpack.config.*',
      'jest.config.*',
      'playwright.config.*',
      '.storybook/**',
    ],
  },
];
