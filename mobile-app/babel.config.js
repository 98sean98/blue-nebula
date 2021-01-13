module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@src': './src',
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@config': './src/config',
          '@containers': './src/containers',
          '@models': './src/models',
          '@navigation': './src/navigation',
          '@reduxApp': './src/reduxApp',
          '@styles': './src/styles',
          '@utilities': './src/utilities',
        },
      },
    ],
  ],
};
