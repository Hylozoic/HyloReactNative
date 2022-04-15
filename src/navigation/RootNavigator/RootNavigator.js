import React, { useEffect, useState } from 'react'
import { View, Linking } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { navigationRef } from 'navigation/linking/helpers'
import OneSignal from 'react-native-onesignal'
import customLinking, {
  navigateToLinkingPath,
  AUTH_ROOT_SCREEN_NAME,
  NON_AUTH_ROOT_SCREEN_NAME,
  INITIAL_AUTH_NAV_STATE
} from 'navigation/linking'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import getReturnToOnAuthPath from 'store/selectors/getReturnToOnAuthPath'
import registerDevice from 'store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import { getAuthorized, getAuthStateLoading } from 'store/selectors/getAuthState'
import SocketListener from 'components/SocketListener'
import RNBootSplash from 'react-native-bootsplash'
import LoadingScreen from 'screens/LoadingScreen'
import ItemChooser from 'screens/ItemChooser'
import checkLogin from 'store/actions/checkLogin'
import { white } from 'style/colors'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
import AuthRootNavigator from 'navigation/AuthRootNavigator'
import NonAuthRootNavigator from 'navigation/NonAuthRootNavigator'
import JoinGroup from 'screens/JoinGroup'
import LoginByTokenHandler from 'screens/LoginByTokenHandler'

const Root = createStackNavigator()
export default function RootNavigator () {
  const dispatch = useDispatch()
  const authStateLoading = useSelector(getAuthStateLoading)
  const isAuthorized = useSelector(getAuthorized)
  const returnToOnAuthPath = useSelector(getReturnToOnAuthPath)
  const [initialURL, setInitialURL] = useState()
  const [navigationIsReady, setNavigationIsReady] = useState(false)

  // This should be (nearly) the only place we check for a session from the API.
  // Routes will not be available until this check is complete.
  useEffect(() => {
    (async function () {
      setInitialURL(await Linking.getInitialURL())
      dispatch(checkLogin())
    })()
  }, [])

  // Handle Push Notifications opened. NOTE the handler it's important that the
  // handlers is returned so it gets cleaned-up on unmount
  useEffect(() => OneSignal.setNotificationOpenedHandler(({ notification }) => {
    const path = notification?.additionalData?.path
    navigateToLinkingPath(path)
  }), [])

  // Everything that happens once a user is successfully Authorized
  useEffect(() => {
    (async function () {
      if (!authStateLoading && navigationIsReady) {
        if (initialURL) navigateToLinkingPath(initialURL)

        if (isAuthorized) {
          const response = await dispatch(fetchCurrentUser())

          if (!response.payload?.getData()?.error) {
            const deviceState = await OneSignal.getDeviceState()

            if (deviceState?.userId) {
              await dispatch(registerDevice(deviceState?.userId))
              OneSignal.setExternalUserId(response.payload?.getData()?.me?.id)
              // Prompt for push on iOS
              OneSignal.promptForPushNotificationsWithUserResponse(() => {})
            } else {
              console.log('Note: Not registering to OneSignal for push notifications. OneSignal did not successfully retrieve a userId')
            }
          }

          if (returnToOnAuthPath) {
            dispatch(setReturnToOnAuthPath())
            navigateToLinkingPath(returnToOnAuthPath)
          }
        }
      }
    }())
  }, [authStateLoading, isAuthorized, navigationIsReady, returnToOnAuthPath])

  // if (authStateLoading) return <LoadingScreen />

  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white }
    }
  }

  return (
    <View style={styles.rootContainer}>
      {/* <LoadingScreen visible={authStateLoading} /> */}
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        onReady={() => {
          setNavigationIsReady(true)
          RNBootSplash.hide()
        }}
        // This will be override or be overriden by `getInitalURL` ?
        initialState={(!initialURL && isAuthorized) ? INITIAL_AUTH_NAV_STATE : null}
        // NOTE: Uncomment below to get a map of the state
        // onStateChange={state => console.log('!!! onStateChange:', state.routes)}
      >
        <Root.Navigator {...navigatorProps}>
          {/* Logged in */}
          {isAuthorized && (
            <Root.Screen name={AUTH_ROOT_SCREEN_NAME} component={AuthRootNavigator} options={{ headerShown: false }} />
          )}
          {/* Not logged-in or Signing-up */}
          {!isAuthorized && (
            <Root.Screen name={NON_AUTH_ROOT_SCREEN_NAME} component={NonAuthRootNavigator} options={{ headerShown: false }} />
          )}
          {/* Screens always available */}
          <Root.Screen name='Loading' component={LoadingScreen} />
          <Root.Screen name='LoginByTokenHandler' options={{ headerShown: false }} component={LoginByTokenHandler} />
          <Root.Group screenOptions={{ presentation: 'modal', header: ModalHeader }}>
            <Root.Screen
              name='JoinGroup'
              component={JoinGroup}
              options={{ title: 'Joining Group...' }}
            />
            <Root.Screen name='ItemChooser' component={ItemChooser} />
          </Root.Group>
        </Root.Navigator>
      </NavigationContainer>
      {isAuthorized && <SocketListener />}
    </View>
  )
}

const styles = {
  rootContainer: {
    flex: 1
  }
}

// NOTE: Another option for handling initial state:
// if (!initialURL && isAuthorized) {
//   navigationRef.current?.navigate('Drawer', { screen:'Tabs', params: { screen: 'Home Tab', params: { screen: 'Feed' } } })
// }
