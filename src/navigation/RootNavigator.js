
import 'react-native-gesture-handler' // is this necessary?
import React from 'react'
import { Dimensions } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import AppNavigator from 'navigation/AppNavigator'
import DrawerMenu from 'screens/DrawerMenu'
import JoinGroup from 'screens/JoinGroup'
import InviteExpired from 'screens/InviteExpired'
import ForgotPassword from 'screens/ForgotPassword'
import Login from 'screens/Login'
import SignupNavigator from 'navigation/SignupNavigator'
import { white } from 'style/colors'

const Root = createDrawerNavigator()
export default function RootStack (props) {
  const { signedIn, signupInProgress, currentUser } = props
  const fullyAuthorized = signedIn && !signupInProgress && currentUser
  const navigatorProps = {
    drawerType: 'slide',
    drawerStyle: {
      width: Dimensions.get('window').width * 0.9
    },
    drawerContent: props => fullyAuthorized ? <DrawerMenu {...props} /> : <></>,
    screenOptions: {
      headerShown: false
    }    
  }

  return <Root.Navigator {...navigatorProps}>
    {fullyAuthorized ? <>
      <Root.Screen name='AppNavigator' component={AppNavigator} />
      <Root.Screen name='JoinGroup' component={JoinGroup} />
      <Root.Screen name='InviteExpired' component={InviteExpired} />          
    </> : <>
      <Root.Screen name='Login' component={Login}
        options={{ animationEnabled: false }}
        initialParams={props} />
      <Root.Screen name='ForgotPassword' component={ForgotPassword}
        options={{
          title: 'Reset Your Password',
          headerShown: true,
          headerBackTitleVisible: false
        }} />
      <Root.Screen name='Signup' component={SignupNavigator} />
    </>}
  </Root.Navigator>
}

// Still needed on the 3 Auth Screens?:
// cardStyle: {
//   backgroundColor: white
// }
