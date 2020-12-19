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
          '.ios.tsx'
        ],
        root: ['./src'],
        alias: {
          'config': './config',
          'assets': './assets'
        }
      }
    ]
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
