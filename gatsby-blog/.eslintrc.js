module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  plugins: ['react'],
  globals: {
    graphql: false,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
}
