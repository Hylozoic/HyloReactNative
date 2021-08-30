import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { WorkflowModalHeader } from './header/ModalHeader'
import ForgotPassword from 'screens/ForgotPassword'
import Login from 'screens/Login'
import SignupComponent from 'screens/Signup'
import SignupFlow1 from 'screens/SignupFlow/SignupFlow1'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'
import SignupFlow3 from 'screens/SignupFlow/SignupFlow3'
import SignupFlow4 from 'screens/SignupFlow/SignupFlow4'
import SignupFlow5 from 'screens/SignupFlow/SignupFlow5'
import ItemChooser from 'screens/ItemChooser'

const Signup = createStackNavigator()
export default function SignupNavigator () {
  const navigatorProps = {
    screenOptions: {
      header: headerProps => <WorkflowModalHeader {...headerProps} />
    }
  }
  return (
    <Signup.Navigator {...navigatorProps}>
      <Signup.Screen name='Signup Intro' component={SignupComponent}
        options={{ headerShown: false }} />
      <Signup.Screen name='SignupFlow1' component={SignupFlow1} 
        options={{ headerTitle: 'STEP 1/5' }} />
      <Signup.Screen name='SignupFlow2' component={SignupFlow2}
        options={{ headerTitle: 'STEP 2/5' }} />
      <Signup.Screen name='SignupFlow3' component={SignupFlow3}
        options={{ headerTitle: 'STEP 3/5' }} />
      <Signup.Screen name='SignupFlow4' component={SignupFlow4}
        options={{ headerTitle: 'STEP 4/5' }} />
      <Signup.Screen name='SignupFlow5' component={SignupFlow5}
        options={{ headerTitle: 'STEP 5/5' }} />
      <Signup.Screen name='ItemChooser' component={ItemChooser} />
    </Signup.Navigator>
  )
}
