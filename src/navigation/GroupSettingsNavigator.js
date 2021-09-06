import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
// Screens
import GroupSettingsMenu from 'screens/GroupSettingsMenu'
import GroupSettingsComponent from 'screens/GroupSettings'
import InvitePeople from 'screens/InvitePeople'
import ModeratorSettings from 'screens/ModeratorSettings'

const GroupSettings = createStackNavigator()
export default function GroupSettingsNavigator () {
  const navigatorProps = {
    screenOptions: {
      header: props => <ModalHeader {...props}
        headerLeftCloseIcon={false}
        headerBackTitleVisible={false}
      />
    }
  }
  return (
    <GroupSettings.Navigator {...navigatorProps}>
      <GroupSettings.Screen
        name='Group Settings' component={GroupSettingsMenu}
        options={{ header: headerProps => <ModalHeader {...headerProps} headerLeftCloseIcon /> }}
      />
      <GroupSettings.Screen name='Group Information' component={GroupSettingsComponent} />
      <GroupSettings.Screen name='Group Moderators' component={ModeratorSettings} />
      <GroupSettings.Screen
        name='Invite Members' component={InvitePeople}
        options={{ header: headerProps =>
          <ModalHeader {...headerProps} title='Invite' headerLeftCloseIcon />
        }}
      />
    </GroupSettings.Navigator>
  )
}
