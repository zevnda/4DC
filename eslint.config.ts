import type { ESLint, Linter } from 'eslint'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

const config: Linter.Config[] = [
  {
    ignores: ['.build/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2018,
      sourceType: 'module' as const,
    },
    plugins: {
      '@typescript-eslint': tseslint as unknown as ESLint.Plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'strict': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'none',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-multiple-empty-lines': 'warn',
      'no-unreachable': 'error',
      'no-sync': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'quotes': ['warn', 'single'],
      'object-shorthand': ['warn', 'always'],
    },
  },
]

export default config
