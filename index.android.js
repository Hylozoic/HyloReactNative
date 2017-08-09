import RootView from './src/components/RootView'
import { AppRegistry } from 'react-native'

AppRegistry.registerComponent('HyloReactNative', () => RootView)

// Removes the yellow warning box related to https://github.com/facebook/react-native/issues/12981
console.ignoredYellowBox = [
  'Setting a timer'
]

export default RootView
