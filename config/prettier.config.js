import wordpressPrettierConfig from '@wordpress/prettier-config';

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...wordpressPrettierConfig,
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'es5',
  semi: true,
  bracketSpacing: true,
  parenSpacing: false,
};

console.info('[vtx-build] Prettier configuration loaded:', config);

export default config;
