/* eslint-disable no-global-assign */
import RootView from './src/components/RootView'
import { AppRegistry, Platform } from 'react-native'
import Timer from 'react-native-background-timer'

if (Platform.OS === 'android') {
  /*
   * We get these long polling warnings in development, which can actually cause problems in
   * production.  Here's a workaround (https://github.com/facebook/react-native/issues/12981),
   * which ends up breaking `hot reloading` in development mode, hence the isProduction conditional here.
   */
  if (process.env.NODE_ENV === 'production') {
    setTimeout = Timer.setTimeout.bind(Timer)
    setInterval = Timer.setInterval.bind(Timer)
    clearTimeout = Timer.clearTimeout.bind(Timer)
    clearInterval = Timer.clearInterval.bind(Timer)
  } else {
    console.ignoredYellowBox = [
      'Setting a timer'
    ]
  }
}

AppRegistry.registerComponent('HyloReactNative', () => RootView)

export default RootView
