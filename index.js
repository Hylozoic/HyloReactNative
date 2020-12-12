/* eslint-disable no-global-assign */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry, Platform, AppState } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Timer from 'react-native-background-timer'
import * as Sentry from '@sentry/react-native'
import OneSignal from 'react-native-onesignal'
import { isDev } from './src/config'
import getStore from './src/store'
import { name as appName } from './app.json'
import ErrorBoundary from 'components/ErrorBoundary'
import RootView from 'components/RootView'

const store = getStore()

if (!isDev) {
  Sentry.init({ dsn: process.env.SENTRY_DSN_URL })
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

export default class AppContainer extends Component {
  constructor (properties) {
    super(properties)
    this.state = {
      appState: AppState.currentState,
      openedPushNotification: null
    }
    // Uncomment for OneSignal debugging
    // OneSignal.setLogLevel(6, 0)
    OneSignal.init(isDev
      ? process.env.ONESIGNAL_APP_ID_DEBUG
      : process.env.ONESIGNAL_APP_ID_RELEASE,
    {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2
    }
    )
    OneSignal.addEventListener('opened', this.handleOpenedPushNotification)
    // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    // 0 = None, 1 = InAppAlert, 2 = Notification
    OneSignal.inFocusDisplaying(0)
  }

  componentDidMount () {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleAppStateChange)
    OneSignal.removeEventListener('opened', this.handleOpenedPushNotification)
  }

  handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      OneSignal.clearOneSignalNotifications()
    }
    this.setState({ appState: nextAppState })
  }

  handleOpenedPushNotification = ({ notification }) =>
    this.setState({ openedPushNotification: notification.payload })

  render () {
    const { openedPushNotification } = this.state

    return (
      <ErrorBoundary>
        <Provider store={store}>
          <SafeAreaProvider>
            <RootView openedPushNotification={openedPushNotification} />
          </SafeAreaProvider>
        </Provider>
      </ErrorBoundary>
    )
  }
}
