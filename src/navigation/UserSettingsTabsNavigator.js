import React, { useLayoutEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { isIOS } from 'util/platform'
import { ModalHeader } from 'navigation/headers'
import { caribbeanGreen, rhino, rhino05, rhino30, white } from 'style/colors'
import logoutAction from 'store/actions/logout'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
// Screens
import HyloWebView from 'screens/HyloWebView'
import BlockedUsers from 'screens/BlockedUsers'

// Existing User Settings screens built not currently in use:
// import UserSettingsComponent from 'screens/UserSettings'
// import ModeratorSettings from 'screens/ModeratorSettings'
// import InvitePeople from 'screens/InvitePeople'

const UserSettings = createMaterialTopTabNavigator()
export default function UserSettingsTabsNavigator ({ navigation, route }) {
  const dispatch = useDispatch()
  const logout = () => dispatch(logoutAction())
  const navigatorProps = {
    screenOptions: {
      tabBarActiveTintColor: caribbeanGreen,
      tabBarInactiveTintColor: rhino30,
      tabBarIndicatorStyle: { backgroundColor: caribbeanGreen },
      tabBarLabelStyle: {
        fontSize: 16,
        textTransform: 'none'
      },
      tabBarScrollEnabled: true,
      tabBarStyle: (
        isIOS
        ? {
            display: 'flex',
            backgroundColor: rhino05
          }
        : {
            display: 'flex',
            backgroundColor: rhino05,
            borderTopWidth: StyleSheet.hairlineWidth
          }
      )
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerShown: true,
      headerStyle: { backgroundColor: rhino },
      headerTitleStyle: { color: white },
      header: headerProps => (
        <ModalHeader {...headerProps}
          // headerLeftConfirm={true}
          // headerLeftCloseIcon={false}
          headerLeft={() => {}}
          headerLeftOnPress={() => navigation.navigate('Home Tab')}
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
            onDiscard: logout
          })}
        />
      )
    })
  }, [navigation, route])

  return (
    <UserSettings.Navigator {...navigatorProps}>
      <UserSettings.Screen
        name='Edit Profile'
        component={HyloWebView}
        initialParams={{
          path: 'settings'
        }}
      />
      <UserSettings.Screen
        name='Afflilations'
        component={HyloWebView}
        initialParams={{
          path: 'settings/groups'
        }}
      />
      <UserSettings.Screen
        name='Invites &amp; Requests'
        component={HyloWebView}
        initialParams={{
          path: 'settings/invitations'
        }}
      />
      <UserSettings.Screen
        name='Notifications'
        component={HyloWebView}
        initialParams={{
          path: 'settings/notifications'
        }}
      />
      <UserSettings.Screen
        name='Account'
        component={HyloWebView}
        initialParams={{
          path: 'settings/account'
        }}
      />
      <UserSettings.Screen
        name='Saved Searches'
        component={HyloWebView}
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
