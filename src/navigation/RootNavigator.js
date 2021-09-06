
import 'react-native-gesture-handler' // is this necessary?
import React from 'react'
import { Dimensions } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { white } from 'style/colors'
import { ModalHeader } from 'navigation/headers'
// Navigation
import SignupNavigator from 'navigation/SignupNavigator'
import TabsNavigator from 'navigation/TabsNavigator'
import CreateGroupNavigator from 'navigation/CreateGroupNavigator'
import GroupSettingsNavigator from 'navigation/GroupSettingsNavigator'
// Screens
import DrawerMenu from 'screens/DrawerMenu'
import JoinGroup from 'screens/JoinGroup'
import InviteExpired from 'screens/InviteExpired'
import ForgotPassword from 'screens/ForgotPassword'
import Login from 'screens/Login'
import BlockedUsers from 'screens/BlockedUsers'
import ItemChooser from 'screens/ItemChooser'
import LoadingScreen from 'screens/LoadingScreen'
import NotificationSettings from 'screens/NotificationSettings'
import NotificationsList from 'screens/NotificationsList'
import PostEditor from 'screens/PostEditor'
import UserSettings from 'screens/UserSettings'

const Root = createDrawerNavigator()
export default function RootStack (props) {
  const { signedIn, signupInProgress, currentUser } = props
  const fullyAuthorized = signedIn && !signupInProgress && currentUser
  const navigatorProps = {
    drawerType: 'slide',
    drawerStyle: {
      width: Dimensions.get('window').width * 0.9
    },
    drawerContent: props => fullyAuthorized
      ? <DrawerMenu {...props} />
      : <></>,
    screenOptions: {
      headerShown: true
    }    
  }
  return <Root.Navigator {...navigatorProps}>
    {fullyAuthorized ? <>
        <Root.Group screenOptions={{
          headerShown: true
        }}>
          <Root.Screen name='Tabs' component={TabsNavigator} options={{ headerShown: false }} />
          <Root.Screen name='Edit Post' component={PostEditor} />
          <Root.Screen name='Edit Account Info' component={UserSettings} />
          <Root.Screen
            name='Group Settings' component={GroupSettingsNavigator}
            options={{ headerShown: false }}
          />
          <Root.Screen
            name='Create Group' component={CreateGroupNavigator}
            options={{ headerShown: false }}
          />
          <Root.Screen name='Notifications' component={NotificationsList} />
          <Root.Screen name='Notification Settings' component={NotificationSettings} />
          <Root.Screen name='Blocked Users' component={BlockedUsers} />
          <Root.Screen name='ItemChooser' component={ItemChooser} />
          <Root.Screen name='Loading' component={LoadingScreen} />
        </Root.Group>
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
