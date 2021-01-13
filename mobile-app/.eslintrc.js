module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  rules: {
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'import/namespace': 'off',
    'import/export': 'off',
    'prettier/prettier': 'warn',
    'max-len': [
      'error',
      {
        code: 150,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'react-native/no-inline-styles': 'off',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'jest/expect-expect': [0],
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
    'import/ignore': ['.css', '.scss', '.sass', '.less'],
  },
  parser: '@typescript-eslint/parser',
};
