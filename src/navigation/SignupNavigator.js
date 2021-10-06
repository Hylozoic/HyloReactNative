import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { WorkflowModalHeader } from 'navigation/headers'
import SignupComponent from 'screens/Signup'
import SignupFlow1 from 'screens/SignupFlow/SignupFlow1'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'
import SignupFlow3 from 'screens/SignupFlow/SignupFlow3'
import SignupFlow4 from 'screens/SignupFlow/SignupFlow4'
import ItemChooser from 'screens/ItemChooser'
import { white, white20onCaribbeanGreen } from 'style/colors'

const Signup = createStackNavigator()
export default function SignupNavigator () {
  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white },
      header: headerProps => {
        const close = () => headerProps.navigation.navigate('Signup Intro')
        return <WorkflowModalHeader
          {...headerProps}
          headerLeftCloseIcon
          headerLeftOnPress={close}
          style={{ backgroundColor: white20onCaribbeanGreen }}
        />
      }
    }
  }

  return (
    <Signup.Navigator {...navigatorProps}>
      <Signup.Screen name='Signup Intro' component={SignupComponent}
        options={{ headerShown: false }} />
      <Signup.Screen name='SignupFlow1' component={SignupFlow1}
        options={{ title: 'STEP 1/4' }} />
      <Signup.Screen name='SignupFlow2' component={SignupFlow2}
        options={{ title: 'STEP 2/4' }} />
      <Signup.Screen name='SignupFlow3' component={SignupFlow3}
        options={{ title: 'STEP 3/4' }} />
      <Signup.Screen name='SignupFlow4' component={SignupFlow4}
        options={{ title: 'STEP 4/4' }} />
      <Signup.Screen name='ItemChooser' component={ItemChooser} />
    </Signup.Navigator>
  )
}
