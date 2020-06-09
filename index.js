/* eslint-disable no-global-assign */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootView from './src/components/RootView'
import { AppRegistry, Platform } from 'react-native'
import Timer from 'react-native-background-timer'
import * as Sentry from '@sentry/react-native'
import OneSignal from 'react-native-onesignal'
import ErrorBoundary from './src/components/ErrorBoundary'
import { isDev } from './src/config'
import getStore from './src/store'
import { name as appName } from './app.json'

let store = getStore()

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

// Uncomment this in order to debug un-performant code: https://github.com/maicki/why-did-you-update
// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(React, { exclude: [/^Connect/, /^Icon/, /^TabBarIcon/, /^LinearGradient/] })
// }

// // For OneSignal
// function myiOSPromptCallback(permission){
//   // do something with permission value
// }

export default class AppContainer extends Component {
  constructor(properties) {
    super(properties);
    // Remove this method to stop OneSignal Debugging 
    OneSignal.setLogLevel(6, 0);
    
    OneSignal.init(isDev ? process.env.ONESIGNAL_APP_ID_DEBUG : process.env.ONESIGNAL_APP_ID_RELEASE, {
      kOSSettingsKeyAutoPrompt : false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption:2
    })
    OneSignal.inFocusDisplaying(2) // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    
    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    // OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback)

    OneSignal.addEventListener('received', this.onReceived)
    OneSignal.addEventListener('opened', this.onOpened)
    OneSignal.addEventListener('ids', this.onIds)
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived)
    OneSignal.removeEventListener('opened', this.onOpened)
    OneSignal.removeEventListener('ids', this.onIds)
  }

  onReceived(notification) {
    console.log("Notification received: ", notification)
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)
  }

  onIds(device) {
    console.log('Device info: ', device)
  }
  
  render () {
      return <ErrorBoundary>
      <Provider store={store}>
        <RootView />
      </Provider>
    </ErrorBoundary>
  }
}
