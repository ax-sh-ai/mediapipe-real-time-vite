import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    // '@storybook/addon-onboarding',
    // '@storybook/addon-links',
    '@storybook/addon-essentials',
    // '@chromatic-com/storybook',
    // '@storybook/addon-interactions'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  core:{
    disableTelemetry: true, // 👈 Disables telemetry
    enableCrashReports: false, // 👈 Appends the crash reports to the telemetry events
  },

  staticDirs: ['../public']
};
export default config;
