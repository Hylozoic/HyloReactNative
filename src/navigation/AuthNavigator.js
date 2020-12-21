import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { buildWorkflowHeaderOptions } from 'navigation/header'
import ForgotPassword from 'screens/ForgotPassword'
import Login from 'screens/Login'
import SignupComponent from 'screens/Signup'
import SignupFlow1 from 'screens/SignupFlow/SignupFlow1'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'
import SignupFlow3 from 'screens/SignupFlow/SignupFlow3'
import SignupFlow4 from 'screens/SignupFlow/SignupFlow4'
import SignupFlow5 from 'screens/SignupFlow/SignupFlow5'

const Signup = createStackNavigator()
export function SignupNavigator () {
  const navigatorProps = {}
  return (
    <Signup.Navigator {...navigatorProps}>
      <Signup.Screen name='Signup Intro' component={SignupComponent}
        options={{ headerShown: false }} />
      <Signup.Screen name='SignupFlow1' component={SignupFlow1} 
        options={buildWorkflowHeaderOptions({ title: 'STEP 1/5' })} />
      <Signup.Screen name='SignupFlow2' component={SignupFlow2}
        options={buildWorkflowHeaderOptions({ title: 'STEP 2/5' })} />
      <Signup.Screen name='SignupFlow3' component={SignupFlow3}
        options={buildWorkflowHeaderOptions({ title: 'STEP 3/5' })} />
      <Signup.Screen name='SignupFlow4' component={SignupFlow4}
        options={buildWorkflowHeaderOptions({ title: 'STEP 4/5' })} />
      <Signup.Screen name='SignupFlow5' component={SignupFlow5}
        options={buildWorkflowHeaderOptions({ title: 'STEP 5/5' })} />
    </Signup.Navigator>
  )
}

const Auth = createStackNavigator()
export default function AuthNavigator (props) {
  const navigatorProps = {}

  return (
    <Auth.Navigator {...navigatorProps}>
      <Auth.Screen name='Login' component={Login}
        options={{ headerShown: false, animationEnabled: false }}
        initialParams={props} />
      <Auth.Screen name='ForgotPassword' component={ForgotPassword}
        options={{ title: 'Reset Your Password' }} />
      <Auth.Screen name='Signup' component={SignupNavigator}
        options={{ headerShown: false }}  />
    </Auth.Navigator>
  )
}
