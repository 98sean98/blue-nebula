module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'google',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jest', 'prettier', 'module-resolver'],
  rules: {
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'import/namespace': 'off',
    'import/export': 'off',
    'prettier/prettier': 'warn',
    'module-resolver/use-alias': 'error',
    'max-len': [
      'error',
      {
        code: 200,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    eqeqeq: ['error', 'always'],
    'jest/no-export': 'warn',
    'require-jsdoc': 'warn',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
