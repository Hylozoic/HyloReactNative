/* eslint-disable no-global-assign */
import React from 'react'
import RootView from './src/components/RootView'
import { AppRegistry, Platform } from 'react-native'
import Timer from 'react-native-background-timer'
import { Sentry } from 'react-native-sentry'
import ErrorBoundary from './src/components/ErrorBoundary'

Sentry.config('https://fd5d26d434e14aa09ce182f2c73b80bb:47b73736cae84b2f854015df24edaa5b@sentry.io/276500').install()

if (Platform.OS === 'android') {
  // We get these long polling warnings in development, which can actually cause
  // problems in production.  Here's a workaround.
  // https://github.com/facebook/react-native/issues/12981
  setTimeout = (fn, ms = 0) => Timer.setTimeout(fn, ms)
  setInterval = (fn, ms = 0) => Timer.setInterval(fn, ms)
  clearTimeout = (fn, ms = 0) => Timer.clearTimeout(fn, ms)
  clearInterval = (fn, ms = 0) => Timer.clearInterval(fn, ms)
}

AppRegistry.registerComponent('HyloReactNative', () => RootView)

export default AppContainer

function AppContainer () {
  return <ErrorBoundary>
    <RootView />
  </ErrorBoundary>
}
