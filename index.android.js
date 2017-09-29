/* eslint-disable no-global-assign */
import RootView from './src/components/RootView'
import { AppRegistry } from 'react-native'
import Timer from 'react-native-background-timer'

setTimeout = Timer.setTimeout.bind(Timer)
setInterval = Timer.setInterval.bind(Timer)
clearTimeout = Timer.clearTimeout.bind(Timer)
clearInterval = Timer.clearInterval.bind(Timer)

AppRegistry.registerComponent('HyloReactNative', () => RootView)

export default RootView
