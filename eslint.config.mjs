import eslint from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import * as pluginImportX from 'eslint-plugin-import-x';
import jestPlugin from 'eslint-plugin-jest';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  perfectionist.configs['recommended-natural'],
  {
    ignores: [
      'data',
      'dist',
      'node_modules',
      './src/gitTools/**/*',
      './features/*',
      'jest.config.mjs',
    ],
  },
  { files: ['**/*.ts', '**/*.tsx'], ...pluginImportX.flatConfigs.recommended },
  { files: ['**/*.ts', '**/*.tsx'], ...pluginImportX.flatConfigs.typescript },
  ...tseslint.configs.recommended,
  { files: ['src/*.ts', 'src/*.tsx'], ...eslint.configs.recommended },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: { ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
      'class-methods-use-this': ['off'],
      'import-x/no-default-export': ['error'],
      'import-x/no-duplicates': ['error'],
      'import-x/no-extraneous-dependencies': ['off'],
      'import-x/no-relative-packages': ['error'],
      'import-x/no-unresolved': ['error'],
      'import-x/prefer-default-export': ['off'],
      'no-await-in-loop': 'warn',
      // 'no-console': 'error',
      'no-param-reassign': 'error',
      // '@typescript-eslint/naming-convention': ['off'],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-restricted-syntax': [
        'error',
        {
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
          selector: 'ForInStatement',
        },
        {
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
          selector: 'LabeledStatement',
        },
        {
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
          selector: 'WithStatement',
        },
      ],
      'no-underscore-dangle': ['off'],
      'no-useless-escape': 'off',
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()],
      'import/internal-regex': '^@lit-protocol/',
    },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // enable jest rules on test files
    files: ['tests/**/*.ts'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'no-await-in-loop': 'off',
    },
  },
];
