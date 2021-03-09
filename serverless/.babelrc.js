module.exports = {
  presets: [
    [`@babel/preset-env`, { targets: { node: `current` } }],
    `@babel/preset-typescript`,
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.js', '.json'],
        alias: {
          '@artifacts': './src/artifacts',
          '@functions': './src/functions',
          '@schema': './src/schema',
          '@utilities': './src/utilities',
        },
      },
    ],
  ],
};
