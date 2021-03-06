module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    "@vue/standard",
    "plugin:vue/strongly-recommended"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'template-curly-spacing' : 'off',
    'indent' : "off"
    },
  parserOptions: {
    parser: 'babel-eslint'
  }
}