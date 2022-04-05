import 'react-native-gesture-handler' // probably not necessary as already included in index.js
import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
import Login from 'screens/Login'
import ForgotPassword from 'screens/ForgotPassword'
import SignupNavigator from 'navigation/SignupNavigator'
import { white } from 'style/colors'
import { getAuthenticated, getSignupComplete } from 'store/selectors/getSignupState'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { CHECK_LOGIN, FETCH_CURRENT_USER, LOGIN, UPDATE_USER_SETTINGS } from 'store/constants'
import { LOGIN_WITH_APPLE, LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE } from 'screens/Login/actions'

const NonAuthRoot = createStackNavigator()
export default function NonAuthRootNavigator () {
  const navigation = useNavigation()
  const isAuthenticated = useSelector(getAuthenticated)
  // const loading = useSelector(state =>
  //   state.pending[FETCH_CURRENT_USER] ||
  //   state.pending[CHECK_LOGIN] ||
  //   state.pending[UPDATE_USER_SETTINGS]
  // )

  const loading = useSelector(state => {
    return state.pending[LOGIN] ||
      state.pending[LOGIN_WITH_APPLE] ||
      state.pending[LOGIN_WITH_FACEBOOK] ||
      state.pending[LOGIN_WITH_GOOGLE] ||
      state.pending[CHECK_LOGIN] ||
      state.pending[FETCH_CURRENT_USER] ||
      state.pending[UPDATE_USER_SETTINGS]
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Signup')
    }
  }, [isAuthenticated])

  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white },
      headerShown: false,
      header: headerProps => <ModalHeader {...headerProps} />
    }
  }

  return (
    <NonAuthRoot.Navigator {...navigatorProps}>
      <NonAuthRoot.Screen
        name='Login'
        component={Login}
        options={{
          animationEnabled: false
        }}
      />
      <NonAuthRoot.Screen
        name='ForgotPassword'
        component={ForgotPassword}
        options={{
          headerShown: true,
          title: 'Reset Your Password'
        }}
      />
      <NonAuthRoot.Screen
        name='Signup'
        component={SignupNavigator}
      />
    </NonAuthRoot.Navigator>
  )
}
