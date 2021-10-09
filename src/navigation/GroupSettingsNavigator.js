import React, { useLayoutEffect } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import Icon from 'components/Icon'
import { isIOS } from 'util/platform'
import { ModalHeader } from 'navigation/headers'
// Screens
import GroupSettingsComponent from 'screens/GroupSettings'
import ModeratorSettings from 'screens/ModeratorSettings'
import InvitePeople from 'screens/InvitePeople'
import { caribbeanGreen, gunsmoke, rhino, rhino05, rhino20, rhino30, rhino50, rhino60, rhino80, white } from 'style/colors'
import Avatar from 'components/Avatar'

const GroupSettings = createMaterialTopTabNavigator()
export default function GroupSettingsNavigator ({ navigation, route }) {
  const currentGroup = useSelector(getCurrentGroup)
  const groupName = currentGroup?.name

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: currentGroup?.name,
      headerStyle: { backgroundColor: rhino },
      headerTitleStyle: { color: white },
      headerTitle: props => {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar style={{ marginRight: 8 }} avatarUrl={currentGroup?.avatarUrl} dimension={30} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: white }}>{currentGroup?.name}</Text>
          </View>
        )
      }
    })
  }, [navigation, route, groupName])

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
    <GroupSettings.Navigator {...navigatorProps}>
      <GroupSettings.Screen
        name='Edit Group Info'
        component={GroupSettingsComponent}
        options={{ title: 'Edit' }}
      />
      <GroupSettings.Screen
        name='Group Moderators'
        component={ModeratorSettings}
        options={{ title: 'Moderators' }}
      />
      <GroupSettings.Screen
        name='Invite Members'
        component={InvitePeople}
        options={{ title: 'Invite' }}
      />
    </GroupSettings.Navigator>
  )
}
