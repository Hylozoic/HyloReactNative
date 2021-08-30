import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { buildModalScreenOptions, buildWorkflowModalScreenOptions } from 'navigation/header'
// Navigation
import TabsNavigator from 'navigation/TabsNavigator'
import CreateGroupNavigator from 'navigation/CreateGroupNavigator'
import GroupSettingsNavigator from 'navigation/GroupSettingsNavigator'
// Screens
import BlockedUsers from 'screens/BlockedUsers'
import ItemChooser from 'screens/ItemChooser'
import LoadingScreen from 'screens/LoadingScreen'
import NotificationSettings from 'screens/NotificationSettings'
import NotificationsList from 'screens/NotificationsList'
import PostEditor from 'screens/PostEditor'
import UserSettings from 'screens/UserSettings'

const App = createStackNavigator()
export default function AppNavigator () {
  const navigatorProps = {
    screenOptions: buildModalScreenOptions
  }
  return (
    <App.Navigator {...navigatorProps}>
      <App.Screen name='Tabs' component={TabsNavigator} options={{ headerShown: false }} />
      <App.Screen name='Edit Post' component={PostEditor} />
      <App.Screen name='Edit Account Info' component={UserSettings} />
      <App.Screen
        name='Group Settings' component={GroupSettingsNavigator}
        options={{ headerShown: false }}
      />
      <App.Screen
        name='Create Group' component={CreateGroupNavigator}
        options={{ headerShown: false }}
      />
      <App.Screen name='Notifications' component={NotificationsList} />
      <App.Screen name='Notification Settings' component={NotificationSettings} />
      <App.Screen name='Blocked Users' component={BlockedUsers} />
      <App.Screen name='ItemChooser' component={ItemChooser} />
      <App.Screen name='Loading' component={LoadingScreen} />
    </App.Navigator>
  )
}
