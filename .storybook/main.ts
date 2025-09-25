import type { StorybookConfig } from '@storybook/html-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/html-webpack5',
    options: {},
  },
  webpackFinal: async (cfg) => {
    const c = cfg as any;
    if (!c.module) c.module = { rules: [] };

    // const hasBabelForTs = c.module.rules?.some(
    //   (rule: any) => rule.test && rule.test.toString().includes('tsx?'),
    // );
    // if (!hasBabelForTs) {
    //   c.module.rules?.push({
    //     test: /\.[jt]s$/,
    //     exclude: /node_modules/,
    //     use: {
    //       loader: 'babel-loader',
    //       options: {
    //         presets: [
    //           ['@babel/preset-env', { targets: 'last 1 Chrome version', modules: false }],
    //           ['@babel/preset-typescript', {}],
    //         ],
    //       },
    //     },
    //   });
    // }

    c.module.rules?.push({
      test: /\.[jt]s$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: 'last 1 Chrome version', modules: false }],
            ['@babel/preset-typescript', {}],
          ],
        },
      },
    });

    c.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: path.resolve(__dirname, '../src'),
    });

    if (!c.resolve) c.resolve = { extensions: ['.ts', '.js'] };
    c.resolve.alias = {
      ...(c.resolve.alias || {}),
      src: path.resolve(__dirname, '../src'),
    };
    c.resolve.extensions = Array.from(new Set([...(c.resolve.extensions || []), '.ts', '.js']));

    return c;
  },
};
export default config;
