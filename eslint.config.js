// ESLint is used for correctness only. Formatting is owned entirely by Prettier.

import js from '@eslint/js';
import n from 'eslint-plugin-n';
import globals from 'globals';

export default [
  {
    ignores: ['build/', 'dist/', 'out/', 'spec/manual/public/', 'ai-docs/', 'test/'],
  },

  js.configs.recommended,
  n.configs['flat/recommended-module'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'array-callback-return': ['error', {allowImplicit: true}],
      'consistent-return': 'error',
      eqeqeq: ['error', 'always', {null: 'ignore'}],
      'no-console': ['error', {allow: ['warn']}],
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-prototype-builtins': 'off',
      'no-redeclare': ['error', {builtinGlobals: false}],
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
      'no-unused-vars': [
        'error',
        {vars: 'all', args: 'none', ignoreRestSiblings: true, caughtErrors: 'none'},
      ],
      'no-use-before-define': ['error', {variables: false, classes: false, functions: false}],
      'no-var': 'error',
      'prefer-const': ['error', {destructuring: 'any', ignoreReadBeforeAssign: true}],
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',

      // `x = null` is used deliberately to release large buffers early
      'no-useless-assignment': 'off',
      'no-unassigned-vars': 'off',

      'n/no-unpublished-import': 'off',
      'n/process-exit-as-throw': 'off',
    },
  },

  {
    files: ['spec/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
        expect: 'readonly',
      },
    },
    rules: {
      'no-new': 'off',
      'no-sparse-arrays': 'off',
    },
  },

  {
    files: ['spec/browser/**/*.js'],
    languageOptions: {
      globals: {...globals.browser, ExcelJS: 'readonly', chai: 'readonly'},
    },
  },
];
