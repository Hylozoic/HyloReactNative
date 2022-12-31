/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  },
  resolver: {
    // Needs this if we want to try
    // and load a static HTML file with local JS, CSS, and TTF references.
    // * May need to makes-sure to carry-over defaults
    // assetExts: ['html', 'css', 'jpg', 'png', 'ttf', 'graphql'],
    assetExts: ['png', 'jpg', 'graphql'],
    sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs', 'svg']
  }
}
