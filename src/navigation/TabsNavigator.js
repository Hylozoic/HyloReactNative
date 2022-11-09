import React from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { isIOS } from 'util/platform'
import getMe from 'store/selectors/getMe'
// Helper Components
import Icon from 'components/Icon'
import Avatar from 'components/Avatar'
import { black10OnCaribbeanGreen, gainsboro, gunsmoke, rhino05, rhino10, white } from 'style/colors'
// Screens
import HomeNavigator from 'navigation/HomeNavigator'
import SearchNavigator from 'navigation/SearchNavigator'
import MessagesNavigator from 'navigation/MessagesNavigator'
import UserSettingsTabsNavigator from './UserSettingsTabsNavigator'

const Tabs = createBottomTabNavigator()
export default function TabsNavigator () {
  const navigatorProps = {
    screenOptions: ({ route }) => ({
      // TODO: Required for Android, not iOS
      // Set only for Android as it makes undesirable animation in iOS
      tabBarHideOnKeyboard: !isIOS,
      tabBarShowLabel: true,
      tabBarPressColor: gainsboro,
      tabBarIndicatorStyle: { backgroundColor: white },
      tabBarStyle: isIOS
        ? {
            display: 'flex',
            backgroundColor: rhino10
          }
        : {
            display: 'flex',
            backgroundColor: rhino10,
            borderTopWidth: StyleSheet.hairlineWidth
          },
      tabBarIcon: ({ focused }) => (
        <Icon
          name={route.name.split(' Tab')[0]}
          size={32}
          color={focused ? black10OnCaribbeanGreen : gunsmoke}
          style={{ paddingTop: isIOS ? 0 : 5 }}
        />
      ),
      tabBarLabel: () => null,
      headerShown: false
    })
  }
  const currentUser = useSelector(getMe)

  return (
    <Tabs.Navigator {...navigatorProps}>
      <Tabs.Screen name='Home Tab' component={HomeNavigator} />
      <Tabs.Screen name='Search Tab' component={SearchNavigator} />
      <Tabs.Screen name='Messages Tab' component={MessagesNavigator} />
      <Tabs.Screen
        name='Settings Tab'
        component={UserSettingsTabsNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Avatar
              style={{
                borderWidth: 2,
                borderColor: focused ? black10OnCaribbeanGreen : rhino05
              }}
              dimension={34}
              hasBorder
              avatarUrl={currentUser?.avatarUrl}
            />
          )
        }}
      />
    </Tabs.Navigator>
  )
}
