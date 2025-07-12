/** @type {import("prettier").Config} */
export default {
  tabWidth: 2,
  useTabs: false,
  semi: false,
  printWidth: 120,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  quoteProps: 'consistent',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: ['dotenv', '<TYPES>', '<TYPES>^[.]', '^discord.js$', '<THIRD_PARTY_MODULES>'],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderCaseSensitive: false,
}
