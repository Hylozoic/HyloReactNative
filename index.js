import 'react-native-gesture-handler'
import { enableScreens } from 'react-native-screens'
import React, { Component } from 'react'
// Required for react-native-root-toast
import { RootSiblingParent } from 'react-native-root-siblings'
import { Provider } from 'react-redux'
import { AppRegistry, Platform, AppState } from 'react-native'
import Timer from 'react-native-background-timer'
import * as Sentry from '@sentry/react-native'
import OneSignal from 'react-native-onesignal'
import { isDev } from 'config'
import store from './src/store'
import { name as appName } from './app.json'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import ErrorBoundary from 'screens/ErrorBoundary'
import VersionCheck from 'components/VersionCheck'
import RootView from 'navigation/RootView'

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

enableScreens()

export default class AppContainer extends Component {
  constructor (properties) {
    super(properties)
    this.state = {
      appState: AppState.currentState,
      openedPushNotification: null
    }
    // Uncomment for OneSignal debugging
    // OneSignal.setLogLevel(6, 0)
    OneSignal.setAppId(process.env.ONESIGNAL_APP_ID_RELEASE)
    // OneSignal.setAppId(isDev
    //   ? process.env.ONESIGNAL_APP_ID_DEBUG
    //   : process.env.ONESIGNAL_APP_ID_RELEASE
    // )
    // Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse(() => {})
    OneSignal.setNotificationOpenedHandler(this.handleOpenedPushNotification)
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
      notifReceivedEvent.complete()
    })
  }

  componentDidMount () {
    this.setState({ subscription: AppState.addEventListener('change', this.handleAppStateChange) })
  }

  componentWillUnmount () {
    this.state.subscription && this.state.subscription.remove()
    OneSignal.clearHandlers()
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
      <SafeAreaProvider>
          <ErrorBoundary>
            <RootSiblingParent>
              <Provider store={store}>
                <VersionCheck />
                <RootView openedPushNotification={openedPushNotification} />
              </Provider>
            </RootSiblingParent>
          </ErrorBoundary>
      </SafeAreaProvider>
    )
  }
}
