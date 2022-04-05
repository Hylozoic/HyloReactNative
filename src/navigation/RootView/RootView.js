import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer, useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { navigationRef } from 'navigation/linking/helpers'
import OneSignal from 'react-native-onesignal'
import customLinking, { INITIAL_NAV_STATE } from 'navigation/linking'
import { getAuthorized } from 'store/selectors/getSignupState'
import setReturnToPath from 'store/actions/setReturnToPath'
import SocketListener from 'components/SocketListener'
import RNBootSplash from 'react-native-bootsplash'
import LoadingScreen from 'screens/LoadingScreen'
import ItemChooser from 'screens/ItemChooser'
import InviteExpired from 'screens/InviteExpired'
import checkLogin from 'store/actions/checkLogin'
import { white } from 'style/colors'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
import AuthRootNavigator from 'navigation/AuthRootNavigator'
import NonAuthRootNavigator from 'navigation/NonAuthRootNavigator'
import JoinGroup from 'screens/JoinGroup'
import LoginByTokenHandler from 'screens/LoginByTokenHandler'

const Root = createStackNavigator()
export default function RootView () {
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getAuthorized)
  const [loading, setLoading] = useState(true)

  console.log('!!! isAuthorized in RootView', isAuthorized)
  // This should be the only place we check for a session from the API.
  // Routes will not be available until this check is complete.

  useEffect(() => {
    (async function () {
      setLoading(true)
      await dispatch(checkLogin())
      RNBootSplash.hide()
      setLoading(false)
    })()
  }, [isAuthorized])

  // Handle Push Notifications opened. NOTE the handler it's important that the
  // handlers is returns so it gets cleaned-up on unmount
  useEffect(() => OneSignal.setNotificationOpenedHandler(({ notification }) => {
    const path = notification?.additionalData?.path
    setReturnToPath(path)
  }), [])

  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white }
    }
  }

  return (
    <View style={styles.rootContainer}>
      {loading && <LoadingScreen />}
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        onReady={() => {
          RNBootSplash.hide()
        }}
        initialState={isAuthorized ? INITIAL_NAV_STATE : null}
        // NOTE: Uncomment below to get a map of the state
        // onStateChange={state => console.log('!!! onStateChange:', state.routes)}
      >
        <Root.Navigator {...navigatorProps}>
          {/* Logged in */}
          {isAuthorized && (
            <Root.Screen name='AuthRoot' component={AuthRootNavigator} options={{ headerShown: false }} />
          )}
          {/* Not logged-in or Signing-up */}
          {!isAuthorized && (
            <Root.Screen name='NonAuthRoot' component={NonAuthRootNavigator} options={{ headerShown: false }} />
          )}
          {/* Screens always available */}
          <Root.Screen name='LoginByTokenHandler' options={{ headerShown: false }} component={LoginByTokenHandler} />
          <Root.Group screenOptions={{ presentation: 'modal', header: ModalHeader }}>
            <Root.Screen
              name='JoinGroup'
              component={JoinGroup}
              options={{ title: 'Joining Group...' }}
            />
            {/* TODO: Remove and replace with error message passed back to Login screen */}
            <Root.Screen name='InviteExpired' component={InviteExpired} />
            <Root.Screen name='ItemChooser' component={ItemChooser} />
          </Root.Group>
          <Root.Screen name='Loading' component={LoadingScreen} />
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
