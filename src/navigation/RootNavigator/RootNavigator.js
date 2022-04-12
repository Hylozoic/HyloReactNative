import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { navigationRef } from 'navigation/linking/helpers'
import OneSignal from 'react-native-onesignal'
import customLinking from 'navigation/linking'
import { getAuthorized, getAuthStateLoading } from 'store/selectors/getAuthState'
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
export default function RootNavigator () {
  const dispatch = useDispatch()
  const authStateLoading = useSelector(getAuthStateLoading)
  const isAuthorized = useSelector(getAuthorized)

  // This should be (nearly) the only place we check for a session from the API.
  // Routes will not be available until this check is complete.
  useEffect(() => { dispatch(checkLogin()) }, [])

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
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        onReady={() => {
          RNBootSplash.hide()
        }}
        // This will be override or be overriden by `getInitalURL` ?
        // initialState={isAuthorized ? INITIAL_AUTH_NAV_STATE : INITIAL_NON_AUTH_NAV_STATE}
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
            <Root.Screen name='ItemChooser' component={ItemChooser} />
          </Root.Group>
          <Root.Screen name='Loading' component={LoadingScreen} />
        </Root.Navigator>
      </NavigationContainer>
      {isAuthorized && <SocketListener />}
      <LoadingScreen visible={authStateLoading} />
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
