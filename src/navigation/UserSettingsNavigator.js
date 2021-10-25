import React, { useLayoutEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { isIOS } from 'util/platform'
import { ModalHeader } from 'navigation/headers'
import { caribbeanGreen, rhino, rhino05, rhino30, white } from 'style/colors'
// Screens
import HyloWebView from 'screens/HyloWebView'
import BlockedUsers from 'screens/BlockedUsers'
// Existing settings screens built not currently in use:
// import UserSettingsComponent from 'screens/UserSettings'
// import ModeratorSettings from 'screens/ModeratorSettings'
// import InvitePeople from 'screens/InvitePeople'

const UserSettings = createMaterialTopTabNavigator()
export default function UserSettingsNavigator ({ navigation, route }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'User Settings',
      headerStyle: { backgroundColor: rhino },
      headerTitleStyle: { color: white },
      headerTitle: props => {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: white }}>Test</Text>
          </View>
        )
      }
    })
  }, [navigation, route])

  const navigatorProps = {
    options: {
    },
    screenOptions: {
      headerShown: false,
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
      ),
      // tabBarIcon: ({ focused }) => (
      //   <Icon
      //     name={'Edit'}
      //     size={30}
      //     color={focused ? caribbeanGreen : gunsmoke}
      //     style={{ paddingTop: isIOS ? 0 : 5 }}
      //   />
      // )
    },
    headerTitleStyle: { color: white },
    header: headerProps =>
      <ModalHeader {...headerProps} />
  }

  return (
    <UserSettings.Navigator {...navigatorProps}>
      <UserSettings.Screen
        name='Settings'
        component={HyloWebView}
        initialParams={{
          path: 'settings'
        }}
      />
      <UserSettings.Screen
        name='Groups &amp; Afflilations'
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
