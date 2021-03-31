import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { buildModalScreenOptions, buildWorkflowModalScreenOptions } from 'navigation/header'
// Navigation
import TabsNavigator from 'navigation/TabsNavigator'
// Screens
import BlockedUsers from 'screens/BlockedUsers'
import GroupSettingsMenu from 'screens/GroupSettingsMenu'
import GroupSettingsComponent from 'screens/GroupSettings'
import CreateGroupName from 'screens/CreateGroupFlow/CreateGroupName'
import CreateGroupReview from 'screens/CreateGroupFlow/CreateGroupReview'
import CreateGroupUrl from 'screens/CreateGroupFlow/CreateGroupUrl'
import InvitePeople from 'screens/InvitePeople'
import ItemChooserScreen from 'screens/ItemChooserScreen'
import LoadingScreen from 'screens/LoadingScreen'
import ModeratorSettings from 'screens/ModeratorSettings'
import NotificationSettings from 'screens/NotificationSettings'
import NotificationsList from 'screens/NotificationsList'
import PostEditor from 'screens/PostEditor'
import UserSettings from 'screens/UserSettings'

const CreateGroup = createStackNavigator()
export function CreateGroupNavigator () {
  const navigatorProps = {}
  return (
    <CreateGroup.Navigator {...navigatorProps}>
      <CreateGroup.Screen
        name='CreateGroupName' component={CreateGroupName}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 1/3', headerLeftCloseIcon: true })}
      />
      <CreateGroup.Screen
        name='CreateGroupUrl' component={CreateGroupUrl}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 2/3' })}
      />
      <CreateGroup.Screen
        name='CreateGroupReview' component={CreateGroupReview}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 3/3' })}
      />
      {/* HOLONIC TODO: Add Group Protected, Restricted and Parent Groups selector */}
    </CreateGroup.Navigator>
  )
}

const GroupSettings = createStackNavigator()
export function GroupSettingsNavigator () {
  const navigatorProps = {
    screenOptions: buildModalScreenOptions({
      headerLeftCloseIcon: false,
      headerBackTitleVisible: false
    })
  }
  return (
    <GroupSettings.Navigator {...navigatorProps}>
      <GroupSettings.Screen
        name='Group Settings' component={GroupSettingsMenu}
        options={buildModalScreenOptions({ headerLeftCloseIcon: true })}
      />
      <GroupSettings.Screen name='Group Information' component={GroupSettingsComponent} />
      <GroupSettings.Screen name='Group Moderators' component={ModeratorSettings} />
      <GroupSettings.Screen name='Invite Members' component={InvitePeople} />
    </GroupSettings.Navigator>
  )
}

const App = createStackNavigator()
export default function AppNavigator () {
  const navigatorProps = {
    mode: 'modal',
    headerShown: false,
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
      <App.Screen name='ItemChooserScreen' component={ItemChooserScreen} />
      <App.Screen name='Loading' component={LoadingScreen} />
    </App.Navigator>
  )
}
