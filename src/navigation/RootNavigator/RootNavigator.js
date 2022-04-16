import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { navigationRef } from 'navigation/linking/helpers'
import OneSignal from 'react-native-onesignal'
import RNBootSplash from 'react-native-bootsplash'
import customLinking, {
  navigateToLinkingPath,
  AUTH_ROOT_SCREEN_NAME,
  NON_AUTH_ROOT_SCREEN_NAME
} from 'navigation/linking'
import checkLogin from 'store/actions/checkLogin'
import { getAuthorized } from 'store/selectors/getAuthState'
import { white } from 'style/colors'
import SocketListener from 'components/SocketListener'
import { ModalHeader } from 'navigation/headers'
import ItemChooser from 'screens/ItemChooser'
import JoinGroup from 'screens/JoinGroup'
import LoginByTokenHandler from 'screens/LoginByTokenHandler'
import AuthRootNavigator from 'navigation/AuthRootNavigator'
import NonAuthRootNavigator from 'navigation/NonAuthRootNavigator'
import LoadingScreen from 'screens/LoadingScreen'

const Root = createStackNavigator()
export default function RootNavigator () {
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getAuthorized)
  const [loading, setLoading] = useState(true)
  const [navigationIsReady, setNavigationIsReady] = useState(false)

  // Here and `JoinGroup` should be the only place we check for a session from the API.
  // Routes will not be available until this check is complete.
  useEffect(() => {
    (async function () {
      await dispatch(checkLogin())
      setLoading(false)
    })()
  }, [])

  // Handle Push Notifications opened
  useEffect(() => {
    return OneSignal.setNotificationOpenedHandler(({ notification }) => {
      const path = notification?.additionalData?.path
      navigateToLinkingPath(path)
    })
  }, [])

  useEffect(() => {
    if (navigationIsReady) {
      RNBootSplash.hide()
    }
  }, [dispatch, loading, navigationIsReady])

  if (loading) return <LoadingScreen />

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
        onReady={() => { setNavigationIsReady(true) }}
        // To get a map of the current navigation state:
        // onStateChange={state => console.log('!!! onStateChange:', state.routes)}
      >
        <Root.Navigator {...navigatorProps}>
          {isAuthorized && (
            <Root.Screen name={AUTH_ROOT_SCREEN_NAME} component={AuthRootNavigator} options={{ headerShown: false }} />
          )}
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
