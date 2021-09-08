
import 'react-native-gesture-handler' // is this necessary?
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
// Navigation
import DrawerNavigator from 'navigation/DrawerNavigator'
import SignupNavigator from 'navigation/SignupNavigator'
import CreateGroupNavigator from 'navigation/CreateGroupNavigator'
import GroupSettingsNavigator from 'navigation/GroupSettingsNavigator'
// Screens
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
import { white } from 'style/colors'

const Root = createStackNavigator()
export default function RootNavigator (props) {
  const { signupInProgress, currentUser } = props
  const fullyAuthorized = !signupInProgress && currentUser
  const navigatorProps = {}
  return <Root.Navigator {...navigatorProps}>
    {fullyAuthorized && <>
      <Root.Screen name='Drawer' component={DrawerNavigator} options={{ headerShown: false }} />
      <Root.Group  screenOptions={{ presentation: 'modal', header: ModalHeader }}>
        <Root.Screen name='Edit Post' component={PostEditor} />
        <Root.Screen name='Edit Account Info' component={UserSettings} />
        <Root.Screen name='Group Settings' component={GroupSettingsNavigator} />
        <Root.Screen name='Create Group' component={CreateGroupNavigator}
          options={{ headerShown: false }} />
        <Root.Screen name='Notifications' component={NotificationsList} />
        <Root.Screen name='Notification Settings' component={NotificationSettings} />
        <Root.Screen name='Blocked Users' component={BlockedUsers} />
        <Root.Screen name='ItemChooser' component={ItemChooser} />
      </Root.Group>
      <Root.Screen name='Loading' component={LoadingScreen} />
      <Root.Screen name='JoinGroup' component={JoinGroup} />
      <Root.Screen name='InviteExpired' component={InviteExpired} />
    </>}
    {!fullyAuthorized && <>
      <Root.Group screenOptions={{
        headerShown: false,
        header: headerProps => <ModalHeader {...headerProps} />
      }}>
        <Root.Screen name='Login' component={Login}
          options={{ animationEnabled: false }}
          initialParams={props} />
        <Root.Screen name='ForgotPassword' component={ForgotPassword}
          options={{
            headerShown: true,
            title: 'Reset Your Password'
          }} />
        <Root.Screen name='Signup' component={SignupNavigator} />
      </Root.Group>
    </>}
  </Root.Navigator>
}