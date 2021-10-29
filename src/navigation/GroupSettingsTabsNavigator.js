import React, { useLayoutEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import fetchGroupSettings from 'store/actions/fetchGroupSettings'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { isIOS } from 'util/platform'
import Avatar from 'components/Avatar'
import { caribbeanGreen, rhino, rhino05, rhino30, white } from 'style/colors'
import HyloWebView from 'screens/HyloWebView'
// Existing settings screens built not currently in use:
// import GroupSettingsComponent from 'screens/GroupSettings'
// import ModeratorSettings from 'screens/ModeratorSettings'
// import InvitePeople from 'screens/InvitePeople'

const GroupSettings = createMaterialTopTabNavigator()
export default function GroupSettingsTabsNavigator ({ navigation, route }) {
  const dispatch = useDispatch()
  const currentGroup = useSelector(getCurrentGroup)
  const groupName = currentGroup?.name
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
      headerStyle: { backgroundColor: rhino },
      headerTitleStyle: { color: white },
      // Reload group on exit
      headerLeftOnPress: () => {
        dispatch(fetchGroupSettings(currentGroup.id))
        navigation.goBack()
      },
      headerTitle: props => {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar style={{ marginRight: 8 }} avatarUrl={currentGroup?.avatarUrl} dimension={30} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: white }}>{groupName}</Text>
          </View>
        )
      }
    })
  }, [navigation, route, groupName])

  return (
    <GroupSettings.Navigator {...navigatorProps}>
      <GroupSettings.Screen
        name='Settings'
        component={HyloWebView}
        initialParams={{
          path: `groups/${currentGroup?.slug}/settings`
        }}
      />
      <GroupSettings.Screen
        name='Moderators'
        component={HyloWebView}
        initialParams={{
          path: `groups/${currentGroup?.slug}/settings/moderators`
        }}
      />
      <GroupSettings.Screen
        name='Topics'
        component={HyloWebView}
        initialParams={{
          path: `groups/${currentGroup?.slug}/settings/topics`
        }}
      />
      <GroupSettings.Screen
        name='Invite'
        component={HyloWebView}
        initialParams={{
          path: `groups/${currentGroup?.slug}/settings/invite`
        }}
      />
      <GroupSettings.Screen
        name='Join Requests'
        component={HyloWebView}
        initialParams={{
          path: `groups/${currentGroup?.slug}/settings/requests`
        }}
      />
      <GroupSettings.Screen
        name='Related Groups'
        component={HyloWebView}
        initialParams={{
          path: `groups/${currentGroup?.slug}/settings/relationships`
        }}
      />
      <GroupSettings.Screen
        name='Export Data'
        component={HyloWebView}
        initialParams={{
          path: `groups/${currentGroup?.slug}/settings/export`
        }}
      />
      <GroupSettings.Screen
        name='Delete'
        component={HyloWebView}
        initialParams={{
          path: `groups/${currentGroup?.slug}/settings/delete`
        }}
      />
    </GroupSettings.Navigator>
  )
}
