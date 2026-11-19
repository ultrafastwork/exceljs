'use strict';

// ESLint is used for correctness only. Formatting is owned entirely by Prettier.

const js = require('@eslint/js');
const n = require('eslint-plugin-n');
const globals = require('globals');

module.exports = [
  {
    ignores: ['build/', 'dist/', 'out/', 'spec/manual/public/', 'ai-docs/', 'test/'],
  },

  js.configs.recommended,
  n.configs['flat/recommended-script'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
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

      // `x = null` is used deliberately to release large buffers early
      'no-useless-assignment': 'off',
      'no-unassigned-vars': 'off',

      'n/no-unpublished-require': 'off',
      'n/process-exit-as-throw': 'off',
    },
  },

  {
    files: ['spec/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
        verquire: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      'no-new': 'off',
      'no-sparse-arrays': 'off',
    },
  },
];
