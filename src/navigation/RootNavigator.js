
import 'react-native-gesture-handler' // probably not necessary as already included in index.js
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import RNBootSplash from 'react-native-bootsplash'
import checkLogin from 'store/actions/checkLogin'
import { getAuthorized } from 'store/selectors/getAuthState'
import { white } from 'style/colors'
// Screens
import { ModalHeader } from 'navigation/headers'
import AuthRootNavigator from 'navigation/AuthRootNavigator'
import NonAuthRootNavigator from './NonAuthRootNavigator'
import JoinGroup from 'screens/JoinGroup'
import InviteExpired from 'screens/InviteExpired'
import LoadingScreen from 'screens/LoadingScreen'
import LoginByTokenHandler from 'screens/LoginByTokenHandler'
import ItemChooser from 'screens/ItemChooser'
import { useFocusEffect } from '@react-navigation/native'

const Root = createStackNavigator()
export default function RootNavigator () {
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getAuthorized)
  const [loading, setLoading] = useState(true)

  // This should be the only place we check for a session from the API.
  // Routes will not be available until this check is complete.
  useFocusEffect(
    useCallback(() => {
      (async function () {
        setLoading(true)
        await dispatch(checkLogin())
        RNBootSplash.hide()
        setLoading(false)
      }())
    }, [checkLogin, dispatch, setLoading, RNRootSplash])
  )

  if (loading) {
    return <LoadingScreen />
  }

  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white }
    }
  }

  return (
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
          name='JoinGroup' component={JoinGroup}
          options={{ title: 'Joining Group...' }}
        />
        <Root.Screen name='InviteExpired' component={InviteExpired} />
        <Root.Screen name='ItemChooser' component={ItemChooser} />
      </Root.Group>
      <Root.Screen name='Loading' component={LoadingScreen} />
    </Root.Navigator>
  )
}
