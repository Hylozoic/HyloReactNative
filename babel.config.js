module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'inline-dotenv',
      {
        silent: true
      }
    ],
    'transform-inline-environment-variables',
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
          '.graphql'
        ],
        root: ['./src'],
        alias: {
          'config': './config',
          'assets': './assets'
        }
      }
    ],
    'import-graphql',
    'react-native-reanimated/plugin'
  ],
  env: {
    test: {
      plugins: [
        'remove-style'
      ]
    },
    production: {
      plugins: [
        'transform-remove-console'
      ]
    }
  }
}
