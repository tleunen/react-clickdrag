module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/no-find-dom-node': '0',
  },
  globals: {
    document: true,
    MouseEvent: true,
  },
};
