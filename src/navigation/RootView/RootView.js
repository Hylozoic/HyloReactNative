import React, { useEffect, useState } from 'react'
import { View, SafeAreaView } from 'react-native'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
// Currently a bug with React Navigation Flipper plugin, follow:
// https://github.com/react-navigation/react-navigation/issues/9850
// import { useFlipper } from '@react-navigation/devtools'
import RNBootSplash from 'react-native-bootsplash'
import Loading from 'components/Loading'
import RootNavigator from 'navigation/RootNavigator'
import OneSignal from 'react-native-onesignal'
import customLinking, { navigateToLinkingPath } from 'navigation/linking/custom'

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
      console.log('!!!! navigating to returnToPath and clearing it:', returnToPath)
      // TODO: Make sure that auth path links don't get navigated to too early in the case
      // if (fullyAuthorized || returnToPath is in non-auth paths list ((create in custom linking file)
      navigateToLinkingPath(returnToPath)
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
      <SafeAreaView style={styles.loadingContainer}>
        <Loading size='large' />
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.rootContainer}>
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
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
}

// NOTE: Another option for handling initial state:
// if (!initialURL && fullyAuthorized) {
//   navigationRef.current?.navigate('Drawer', { screen:'Tabs', params: { screen: 'Home Tab', params: { screen: 'Feed' } } })
// }
