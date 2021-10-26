
import 'react-native-gesture-handler' // is this necessary?
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
// Navigation
import DrawerNavigator from 'navigation/DrawerNavigator'
import SignupNavigator from 'navigation/SignupNavigator'
import CreateGroupTabsNavigator from 'navigation/CreateGroupTabsNavigator'
import GroupSettingsTabsNavigator from 'navigation/GroupSettingsTabsNavigator'
// Screens
import JoinGroup from 'screens/JoinGroup'
import InviteExpired from 'screens/InviteExpired'
import ForgotPassword from 'screens/ForgotPassword'
import Login from 'screens/Login'
import ItemChooser from 'screens/ItemChooser'
import LoadingScreen from 'screens/LoadingScreen'
import NotificationSettings from 'screens/NotificationSettings'
import NotificationsList from 'screens/NotificationsList'
import PostEditor from 'screens/PostEditor'
import { white } from 'style/colors'
import PostDetails from 'screens/PostDetails'
import MemberProfile from 'screens/MemberProfile'
import LoginByTokenHandler from 'screens/LoginByTokenHandler'
import PendingInvites from 'screens/PendingInvites'

const Root = createStackNavigator()
export default function RootNavigator ({ fullyAuthorized }) {
  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white }
    }
  }

  return <Root.Navigator {...navigatorProps}>
    {/* Logged in */}
    {fullyAuthorized && <>
      <Root.Screen name='Drawer' component={DrawerNavigator} options={{ headerShown: false }} />
      <Root.Screen name='Create Group' component={CreateGroupTabsNavigator}
          options={{ headerShown: false }} />
      <Root.Group screenOptions={{ presentation: 'modal', header: ModalHeader }}>
        <Root.Screen name='Post Details - Modal' component={PostDetails}
          options={{ title: 'Post Details' }} />
        <Root.Screen name='Member - Modal' component={MemberProfile}
          options={{ title: 'Member' }} />
        <Root.Screen name='Edit Post' component={PostEditor} />
        <Root.Screen name='Group Settings' component={GroupSettingsTabsNavigator} />
        <Root.Screen name='Pending Invites' component={PendingInvites} />
        <Root.Screen name='Notifications - Modal' component={NotificationsList} />
        <Root.Screen name='Notification Settings' component={NotificationSettings} />
      </Root.Group>
    </>}
    {/* Not logged-in or Signing-up */}
    {!fullyAuthorized && <>
      <Root.Group screenOptions={{
        headerShown: false,
        header: headerProps => <ModalHeader {...headerProps} />
      }}>
        <Root.Screen name='Login' component={Login}
          options={{
            animationEnabled: false
          }}
        />
        <Root.Screen name='ForgotPassword' component={ForgotPassword}
          options={{
            headerShown: true,
            title: 'Reset Your Password'
          }} />
        <Root.Screen name='Signup' component={SignupNavigator} />
      </Root.Group>
    </>}
    {/* Screens always available */}
    <Root.Screen name='LoginByTokenHandler' options={{ headerShown: false }} component={LoginByTokenHandler} />
    <Root.Group screenOptions={{ presentation: 'modal', header: ModalHeader }}>
      <Root.Screen name='JoinGroup' component={JoinGroup}
        options={{ title: 'Joining Group...' }} />
      <Root.Screen name='InviteExpired' component={InviteExpired} />
      <Root.Screen name='ItemChooser' component={ItemChooser} />
    </Root.Group>
    <Root.Screen name='Loading' component={LoadingScreen} />
  </Root.Navigator>
}
