// import standard from "eslint-config-standard"
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2015,
      },
    },
    rules: {
      'no-var': [2],
      'prefer-destructuring': [2],
      'object-shorthand': [2],
    },
  },
  {
    files: ['tests/lib/utils/**'],
    languageOptions: {
      globals: globals.mocha,
    },
  },
  eslintPluginPrettierRecommended,
];
