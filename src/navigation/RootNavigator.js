
import 'react-native-gesture-handler' // probably not necessary as already included in index.js
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
import { modalScreenName } from './linking/helpers'
import { white } from 'style/colors'
// Screens
import DrawerNavigator from 'navigation/DrawerNavigator'
import CreateGroupTabsNavigator from 'navigation/CreateGroupTabsNavigator'
import PostDetails from 'screens/PostDetails'
import MemberProfile from 'screens/MemberProfile'
import GroupDetail from 'screens/GroupDetail'
import PostEditor from 'screens/PostEditor'
import GroupSettingsTabsNavigator from 'navigation/GroupSettingsTabsNavigator'
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import PendingInvites from 'screens/PendingInvites'
import NotificationsList from 'screens/NotificationsList'
import NotificationSettings from 'screens/NotificationSettings'
import Login from 'screens/Login'
import ForgotPassword from 'screens/ForgotPassword'
import SignupNavigator from 'navigation/SignupNavigator'
import JoinGroup from 'screens/JoinGroup'
import InviteExpired from 'screens/InviteExpired'
import LoginByTokenHandler from 'screens/LoginByTokenHandler'
import ItemChooser from 'screens/ItemChooser'
import LoadingScreen from 'screens/LoadingScreen'

const Root = createStackNavigator()
export default function RootNavigator ({ isAuthorized }) {
  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white }
    }
  }

  return (
    <Root.Navigator {...navigatorProps}>
      {/* Logged in */}
      {isAuthorized && (
        <>
          <Root.Screen name='Drawer' component={DrawerNavigator} options={{ headerShown: false }} />
          <Root.Screen
            name='Create Group' component={CreateGroupTabsNavigator}
            options={{ headerShown: false }}
          />
          <Root.Group screenOptions={{ presentation: 'modal', header: ModalHeader }}>
            <Root.Screen
              name={modalScreenName('Post Details')} component={PostDetails}
              options={{ title: 'Post Details' }}
            />
            <Root.Screen
              name={modalScreenName('Member')} component={MemberProfile}
              options={{ title: 'Member' }}
            />
            <Root.Screen
              name={modalScreenName('Group Detail')} component={GroupDetail}
              options={{ title: 'Group Details' }}
            />
            <Root.Screen name='Edit Post' component={PostEditor} />
            <Root.Screen name='Group Settings' component={GroupSettingsTabsNavigator} />
            {/* Not used anymore */}
            <Root.Screen name='Edit Your Skills' component={MemberSkillEditor} />
            <Root.Screen name='Pending Invites' component={PendingInvites} />
            <Root.Screen name={modalScreenName('Notifications')} component={NotificationsList} />
            <Root.Screen name='Notification Settings' component={NotificationSettings} />
          </Root.Group>
        </>
      )}
      {/* Not logged-in or Signing-up */}
      {!isAuthorized && (
        <>
          <Root.Group
            screenOptions={{
              headerShown: false,
              header: headerProps => <ModalHeader {...headerProps} />
            }}
          >
            <Root.Screen
              name='Login' component={Login}
              options={{
                animationEnabled: false
              }}
            />
            <Root.Screen
              name='ForgotPassword' component={ForgotPassword}
              options={{
                headerShown: true,
                title: 'Reset Your Password'
              }}
            />
            <Root.Screen name='Signup' component={SignupNavigator} />
          </Root.Group>
        </>
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
