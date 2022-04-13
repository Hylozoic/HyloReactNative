import React, { useLayoutEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { isIOS } from 'util/platform'
import { ModalHeader } from 'navigation/headers'
import { caribbeanGreen, ghost, rhino30, rhino80, white } from 'style/colors'
import logout from 'store/actions/logout'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
// Screens
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
          // headerLeftConfirm={true}
          // headerLeftCloseIcon={false}
          headerLeft={() => {}}
          headerLeftOnPress={() => {
            dispatch(fetchCurrentUser())
            navigation.navigate('Home Tab')
          }}
          // headerTitle = {props => (
          //   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          //     <Avatar style={{ marginRight: 8 }} avatarUrl={currentUser?.avatarUrl} dimension={30} />
          //     <Text style={{ fontSize: 16, fontWeight: 'bold', color: white }}>Settings</Text>
          //   </View>
          // )}
          headerRightButtonLabel='Logout'
          headerRightButtonOnPress={() => confirmDiscardChanges({
            title: 'Logout',
            confirmationMessage: 'Are you sure you want to logout?',
            continueButtonText: 'Cancel',
            disgardButtonText: 'Yes',
            onDiscard: () => dispatch(logout())
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
