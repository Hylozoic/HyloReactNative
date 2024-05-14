import 'react-native-gesture-handler'
import { enableScreens } from 'react-native-screens'
import React, { useEffect, useState } from 'react'
// Required for react-native-root-toast
import { RootSiblingParent } from 'react-native-root-siblings'
import { Provider } from 'react-redux'
import { AppRegistry, Platform, AppState, UIManager } from 'react-native'
import Timer from 'react-native-background-timer'
import * as Sentry from '@sentry/react-native'
import OneSignal from 'react-native-onesignal'
import { isDev } from 'config'
import store from './src/store'
import { name as appName } from './app.json'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TRenderEngineProvider, defaultSystemFonts } from 'react-native-render-html'
import ErrorBoundary from 'screens/ErrorBoundary'
import VersionCheck from 'components/VersionCheck'
import RootNavigator from 'navigation/RootNavigator'
import './i18n'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { baseStyle, tagsStyles, classesStyles } from 'components/HyloHTML/HyloHTML.styles'
// import FastImage from 'react-native-fast-image'

if (!isDev) {
  Sentry.init({ dsn: process.env.SENTRY_DSN_URL })
}

// For Layout animation support: https://reactnative.dev/docs/layoutanimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
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

AppRegistry.registerComponent(appName, () => App)

enableScreens()

// Useful to debug in dev to diagnose any potential image loading issues,
// or simply to start fresh:
// FastImage.clearDiskCache()
// FastImage.clearMemoryCache()

export default function App () {
  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    OneSignal.setAppId(process.env.ONESIGNAL_APP_ID)

    // Uncomment for OneSignal debugging
    // OneSignal.setLogLevel(6, 0)

    // Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
      // Complete with null means don't show a notification.
      notifReceivedEvent.complete()
    })

    const appStateHandler = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      appStateHandler && appStateHandler.remove()
      OneSignal.clearHandlers()
    }
  }, [])

  const handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      OneSignal.clearOneSignalNotifications()
    }
    setAppState(nextAppState)
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ActionSheetProvider>
          <RootSiblingParent>
            {/*
              `TRenderEngineProvider` is the react-native-render-html rendering engine.
              It is app-wide for performance reasons. The styles applied are global and
              not readily overridden. For more details see: https://bit.ly/3MeJCIR
            */}
            <TRenderEngineProvider
              baseStyle={baseStyle}
              tagsStyles={tagsStyles}
              classesStyles={classesStyles}
              systemFonts={[...defaultSystemFonts, 'Circular-Book']}
            >
              <Provider store={store}>
                <VersionCheck />
                <RootNavigator />
              </Provider>
            </TRenderEngineProvider>
          </RootSiblingParent>
        </ActionSheetProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}
