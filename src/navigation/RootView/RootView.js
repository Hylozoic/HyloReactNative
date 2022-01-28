import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import RNBootSplash from 'react-native-bootsplash'
import RootNavigator from 'navigation/RootNavigator'
import OneSignal from 'react-native-onesignal'
import customLinking, { navigateToLinkingPath } from 'navigation/linking/custom'
import SocketListener from 'components/SocketListener'
import LoadingScreen from 'screens/LoadingScreen'

export const navigationRef = createNavigationContainerRef()

export default function RootView ({
  loading,
  signedIn,
  signupInProgress,
  currentUser,
  loadCurrentUserSession,
  returnToPath,
  setReturnToPath
}) {
  const [navIsReady, setNavIsReady] = useState(false)
  const fullyAuthorized = !signupInProgress && currentUser

  // Handle Push Notifications opened
  useEffect(() => OneSignal.setNotificationOpenedHandler(({ notification }) => {
    const path = notification?.additionalData?.path
    setReturnToPath(path)
  }), [])

  // Handle returnToPath
  useEffect(() => {
    if (navIsReady && returnToPath) {
      navigateToLinkingPath(returnToPath, fullyAuthorized)
    }
  }, [navIsReady, fullyAuthorized, returnToPath])

  // Handle loading of currentUser if already "signedIn" via Login screen
  // or on app launch when signedIn status is not yet known
  useEffect(() => {
    if (!signedIn || (signedIn && !currentUser)) {
      loadCurrentUserSession()
    }
  }, [signedIn])

  if (loading && !signupInProgress) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <View style={styles.rootContainer}>
      {fullyAuthorized && <SocketListener />}
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        initialState={fullyAuthorized ? INITIAL_NAV_STATE : null}
        onReady={() => { 
          setNavIsReady(true)
          !loading && RNBootSplash.hide()
        }}
        // NOTE: Uncomment below to get a map of the state
        // onStateChange={state => console.log('!!! onStateChange:', state.routes)}
      >
        <RootNavigator fullyAuthorized={fullyAuthorized} />
      </NavigationContainer>
    </View>
  )
}

export const INITIAL_NAV_STATE = {
  routes: [
    {
      name: 'Drawer',
      state: {
        routes: [
          {
            name: 'Tabs',
            state: {
              routes: [
                {
                  name: 'Home Tab',
                  state: {
                    initialRouteName: 'Feed',
                    routes: [
                      {
                        name: 'Group Navigation'
                      },
                      {
                        name: 'Feed'
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}

const styles = {
  rootContainer: {
    flex: 1
  }
}

// NOTE: Another option for handling initial state:
// if (!initialURL && fullyAuthorized) {
//   navigationRef.current?.navigate('Drawer', { screen:'Tabs', params: { screen: 'Home Tab', params: { screen: 'Feed' } } })
// }
