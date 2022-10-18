import React, { useLayoutEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { isIOS } from 'util/platform'
import { ModalHeader } from 'navigation/headers'
import { caribbeanGreen, ghost, rhino30, rhino80, white } from 'style/colors'
import logout from 'store/actions/logout'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import UserSettingsWebView from 'screens/UserSettingsWebView'
import BlockedUsers from 'screens/BlockedUsers'

// Existing User Settings screens built not currently in use:
// import UserSettingsComponent from 'screens/UserSettings'
// import ModeratorSettings from 'screens/ModeratorSettings'
// import InvitePeople from 'screens/InvitePeople'

const UserSettings = createMaterialTopTabNavigator()
export default function UserSettingsTabsNavigator ({ navigation, route }) {
  const dispatch = useDispatch()
  const navigatorProps = {
    screenOptions: {
      tabBarActiveTintColor: caribbeanGreen,
      tabBarInactiveTintColor: rhino30,
      tabBarIndicatorStyle: {
        backgroundColor: caribbeanGreen
      },
      tabBarLabelStyle: {
        fontSize: 16,
        textTransform: 'none'
      },
      tabBarScrollEnabled: true,
      tabBarStyle: styles.tabBarStyle,
      swipeEnabled: false
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerShown: true,
      headerStyle: { backgroundColor: ghost },
      headerTitleStyle: { color: rhino80 },
      header: headerProps => (
        <ModalHeader
          {...headerProps}
          // Hides "X button
          headerLeft={() => {}}
          // // Bring the below back while hiding `TabBar`
          // // to force reload of User after settings changed:
          // headerLeftConfirm={true}
          // headerLeftCloseIcon={false}
          // headerLeftOnPress={() => {
          //   dispatch(fetchCurrentUser())
          //   navigation.navigate('Home Tab')
          // }}
          headerRightButtonLabel='Logout'
          headerRightButtonOnPress={() => confirmDiscardChanges({
            title: '',
            confirmationMessage: 'Are you sure you want to logout?',
            continueButtonText: 'Cancel',
            disgardButtonText: 'Yes',
            onDiscard: async () => dispatch(logout())
          })}
        />
      )
    })
  }, [navigation, route])

  return (
    <UserSettings.Navigator {...navigatorProps}>
      <UserSettings.Screen
        name='Edit Profile'
        component={UserSettingsWebView}
        initialParams={{
          path: 'settings'
        }}
      />
      <UserSettings.Screen
        name='Afflilations'
        component={UserSettingsWebView}
        initialParams={{
          path: 'settings/groups'
        }}
      />
      <UserSettings.Screen
        name='Invites &amp; Requests'
        component={UserSettingsWebView}
        initialParams={{
          path: 'settings/invitations'
        }}
      />
      <UserSettings.Screen
        name='Notifications'
        component={UserSettingsWebView}
        initialParams={{
          path: 'settings/notifications'
        }}
      />
      <UserSettings.Screen
        name='Account'
        component={UserSettingsWebView}
        initialParams={{
          path: 'settings/account'
        }}
      />
      <UserSettings.Screen
        name='Saved Searches'
        component={UserSettingsWebView}
        initialParams={{
          path: 'settings/saved-searches'
        }}
      />
      <UserSettings.Screen
        name='Blocked Users'
        component={BlockedUsers}
      />
    </UserSettings.Navigator>
  )
}

const styles = {
  tabBarStyle: (
    isIOS
      ? {
          display: 'flex',
          backgroundColor: white
        }
      : {
          display: 'flex',
          backgroundColor: white,
          borderTopWidth: StyleSheet.hairlineWidth
        }
  )
}
