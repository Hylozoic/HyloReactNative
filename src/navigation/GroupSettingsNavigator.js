import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { buildModalScreenOptions } from 'navigation/header'
// Screens
import GroupSettingsMenu from 'screens/GroupSettingsMenu'
import GroupSettingsComponent from 'screens/GroupSettings'
import InvitePeople from 'screens/InvitePeople'
import ModeratorSettings from 'screens/ModeratorSettings'

const GroupSettings = createStackNavigator()
export default function GroupSettingsNavigator () {
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
      <GroupSettings.Screen
        name='Invite Members' component={InvitePeople}
        options={buildModalScreenOptions({ headerTitle: 'Invite', headerLeftCloseIcon: true })}
      />
    </GroupSettings.Navigator>
  )
}
