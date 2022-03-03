module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'standard',
    'standard-react',
    'standard-jsx',
    'eslint-config-prettier'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  plugins: [
    'react',
    'react-native'
  ],
  env: {
    'react-native/react-native': true
  },
  rules: {
    'prettier/prettier': 'off',
    'react/prop-types': 'off'
  },
  overrides: [
    {
      files: [
        '**/*.test.js',
        '**/*.spec.js'
      ],
      extends: [
        'plugin:jest/recommended',
        'plugin:testing-library/react'
      ],
      plugins: [
        'jest',
        'testing-library'
      ],
      env: {
        'jest': true,
        'jest/globals': true
      },
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/prefer-user-event': 'off',
        'testing-library/await-async-query': 'error',
        'testing-library/no-await-sync-query': 'error',
        'testing-library/no-debugging-utils': 'warn',
        'testing-library/no-dom-import': 'off',
        'testing-library/consistent-data-testid': [
          2,
          {
            testIdAttribute: ['testID'],
            testIdPattern: '^TestId(__[A-Z]*)?$'
          }
        ]
      },
      settings: {
        jest: {
          version: require('jest/package.json').version
        }
      }
    }
  ]
}
