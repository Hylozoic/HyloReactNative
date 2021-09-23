import React, { useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from 'navigation/headers'
// Screens
import GroupSettingsMenu from 'screens/GroupSettingsMenu'
import GroupSettingsComponent from 'screens/GroupSettings'
import InvitePeople from 'screens/InvitePeople'
import ModeratorSettings from 'screens/ModeratorSettings'
import { rhino60, white } from 'style/colors'

const GroupSettings = createStackNavigator()
export default function GroupSettingsNavigator ({ navigation, route }) {
  const currentGroup = useSelector(getCurrentGroup)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: currentGroup?.name,
      headerTitleStyle: { color: white },
      headerStyle: { backgroundColor: rhino60 },
      presentation: 'modal',
      header: headerProps =>
        <ModalHeader {...headerProps} />
    })
  }, [navigation, route])

  const navigatorProps = {}

  return (
    <GroupSettings.Navigator {...navigatorProps}>
      <GroupSettings.Screen
        name='Group Settings' component={GroupSettingsMenu}
        options={{ headerShown: false }}
      />
      <GroupSettings.Screen
        name='Edit Group Info'
        component={GroupSettingsComponent}
      />
      <GroupSettings.Screen
        name='Group Moderators'
        options={{ 
          header: headerProps =>
            <ModalHeader
              {...headerProps}
              headerLeftCloseIcon={false}
            />
        }}
        component={ModeratorSettings}
      />
      <GroupSettings.Screen
        name='Invite Members' component={InvitePeople}
        options={{
          header: (headerProps) =>
            <ModalHeader
              {...headerProps}
              headerLeftCloseIcon={headerProps.back.title == 'Tabs'}
            />
        }}
      />
    </GroupSettings.Navigator>
  )
}
