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
          '@src': './src',
          '@artifacts': './src/artifacts',
          '@middleware': './src/middleware',
          '@shield': './src/shield',
          '@utilities': './src/utilities',
        },
      },
    ],
  ],
};
