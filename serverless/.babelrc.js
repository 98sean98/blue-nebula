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
          '@functions': './src/functions',
          '@libs': './src/libs',
          '@utilities': './src/utilities',
        },
      },
    ],
  ],
};
