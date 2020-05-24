/* eslint-disable no-global-assign */
import React from 'react'
import { Provider } from 'react-redux'
import RootView from './src/components/RootView'
import { AppRegistry, Platform } from 'react-native'
import Timer from 'react-native-background-timer'
import { Sentry } from 'react-native-sentry'
import ErrorBoundary from './src/components/ErrorBoundary'
import { isDev } from './src/config'
import getStore from './src/store'
import { name as appName } from './app.json'

let store = getStore()

if (!isDev) {
  Sentry.config(process.env.SENTRY_CONFIG_URL)
  Sentry.install()
}

if (Platform.OS === 'android') {
  // We get these long polling warnings in development, which can actually cause
  // problems in production.  Here's a workaround.
  // https://github.com/facebook/react-native/issues/12981
  setTimeout = (fn, ms = 0) => Timer.setTimeout(fn, ms)
  setInterval = (fn, ms = 0) => Timer.setInterval(fn, ms)
  clearTimeout = (fn, ms = 0) => Timer.clearTimeout(fn, ms)
  clearInterval = (fn, ms = 0) => Timer.clearInterval(fn, ms)
}

AppRegistry.registerComponent(appName, () => AppContainer)

// Uncomment this in order to debug un-performant code: https://github.com/maicki/why-did-you-update
// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(React, { exclude: [/^Connect/, /^Icon/, /^TabBarIcon/, /^LinearGradient/] })
// }

function AppContainer () {
  return <ErrorBoundary>
    <Provider store={store}>
      <RootView />
    </Provider>
  </ErrorBoundary>
}

export default AppContainer
