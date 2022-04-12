import 'react-native-gesture-handler' // probably not necessary as already included in index.js
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
import Login from 'screens/Login'
import ForgotPassword from 'screens/ForgotPassword'
import SignupNavigator from 'navigation/SignupNavigator'
import { white } from 'style/colors'
import { getAuthenticated } from 'store/selectors/getAuthState'
import { useNavigation, useRoute } from '@react-navigation/native'
import { navigateToLinkingPath } from './linking'

const NonAuthRoot = createStackNavigator()
export default function NonAuthRootNavigator () {
  const navigation = useNavigation()
  const route = useRoute()
  const isAuthenticated = useSelector(getAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Signup')
    } else if (route?.params?.initialURL) {
      navigateToLinkingPath(route?.params?.initialURL)
    } else {
      navigation.navigate('Login')
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
        options={{
          animationEnabled: false
        }}
      />
    </NonAuthRoot.Navigator>
  )
}
