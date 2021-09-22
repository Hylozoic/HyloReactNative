import React, { useEffect, useState, createRef } from 'react'
import { View, Linking } from 'react-native'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
// Currently a bug with React Navigation Flipper plugin, follow:
// https://github.com/react-navigation/react-navigation/issues/9850
// import { useFlipper } from '@react-navigation/devtools'
import RNBootSplash from "react-native-bootsplash"
import Loading from 'components/Loading'
import RootNavigator from 'navigation/RootNavigator'
import OneSignal from 'react-native-onesignal'
import linking, { openURLinkApp } from 'navigation/linking'
import customLinking from 'navigation/linking/custom'

export const isReadyRef = createRef()
export const navigationRef = createNavigationContainerRef()

export default function RootView ({
  loading,
  signedIn,
  signupInProgress,
  currentUser,
  loadCurrentUserSession,
  setReturnToPath,
  returnToPath
}) {
  const fullyAuthorized = !signupInProgress && currentUser

  // Capture initialURL
  useEffect(() => {
    const checkInitialURL = async () => {
      const initialPath = await Linking.getInitialURL()
      if (initialPath) setReturnToPath(initialPath)
    }
    checkInitialURL()
  }, [])

  // Handle returnToPath
  useEffect(() => { 
    if (isReadyRef.current && fullyAuthorized && returnToPath) {
      openURLinkApp(returnToPath)
      setReturnToPath(null)
    }
  })

  // Handle Push Notifications opened
  useEffect(() => OneSignal.setNotificationOpenedHandler(({ notification }) => {
    const path = notification?.additionalData?.path
    if (isReadyRef.current && fullyAuthorized) {
      openURLinkApp(path)
    } else {
      setReturnToPath(path)
    }
  }), [])

  // Handle loading of currentUser if already "signedIn" via Login screen
  // or on app launch when signedIn status is not yet known
  useEffect(() => { (!signedIn || (signedIn && !currentUser)) && loadCurrentUserSession() }, [signedIn])

  if (loading && !signupInProgress) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size='large' style={styles.loading} />
      </View>
    )
  }

  return (
    <View style={styles.rootContainer}>
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        initialState={INITIAL_NAV_STATE}
        onReady={async () => { 
          isReadyRef.current = true
          // NOTE: Another option for handling initial state:
          // if (!initialURL && fullyAuthorized) {
          //   navigationRef.current?.navigate('Tabs', { screen: 'Home Tab', params: { screen: 'Feed' } })
          // }
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    marginBottom: 15
  }
}
