module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
    'import/errors',
    'import/warnings',
    'import/typescript',
    'jest/recommended',
    'module-resolver',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  'rules': {
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
    'import/namespace': [0],
    'import/export': [0],
    'prettier/prettier': [1],
    'module-resolver/use-alias': 2,
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
    eqeqeq: ['error', 'always'],
    'jest/expect-expect': [0],
  },
};
