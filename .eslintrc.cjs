module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn'
  }
};
