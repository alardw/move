import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        // Hide internal React/HTML props, keep component-specific ones
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  viteFinal: (config) => {
    // Remove library build settings — Storybook needs to bundle everything
    delete config.build?.lib;
    delete config.build?.rollupOptions;

    // Alias 'move' to the library source so demo-derived stories resolve
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> ?? {}),
      'move/styles.css': path.resolve(__dirname, '../src/styles/system.css'),
      'move': path.resolve(__dirname, '../src/index.ts'),
    };

    return config;
  },
};
export default config;