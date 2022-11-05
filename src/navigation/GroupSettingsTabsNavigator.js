import React, { useLayoutEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { isIOS } from 'util/platform'
import fetchGroupSettings from 'store/actions/fetchGroupSettings'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import GroupSettingsWebView from 'screens/GroupSettingsWebView'
import Avatar from 'components/Avatar'
import { caribbeanGreen, rhino05, rhino30, rhino60, white } from 'style/colors'

const GroupSettings = createMaterialTopTabNavigator()
export default function GroupSettingsTabsNavigator () {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const selectedGroup = useSelector(getCurrentGroup)
  const groupName = selectedGroup?.name
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
      tabBarStyle: styles.tabBarStyle,
      swipeEnabled: false
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: rhino60 },
      headerTitleStyle: { color: white },
      // Reload group on exit
      headerLeftOnPress: () => {
        dispatch(fetchGroupSettings(selectedGroup.id))
        navigation.goBack()
      },
      headerTitle: props => {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar style={{ marginRight: 8 }} avatarUrl={selectedGroup?.avatarUrl} dimension={30} />
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
        component={GroupSettingsWebView}
        initialParams={{
          path: `/groups/${selectedGroup?.slug}/settings`
        }}
      />
      <GroupSettings.Screen
        name='Moderators'
        component={GroupSettingsWebView}
        initialParams={{
          path: `/groups/${selectedGroup?.slug}/settings/moderators`
        }}
      />
      <GroupSettings.Screen
        name='Topics'
        component={GroupSettingsWebView}
        initialParams={{
          path: `/groups/${selectedGroup?.slug}/settings/topics`
        }}
      />
      <GroupSettings.Screen
        name='Invite'
        component={GroupSettingsWebView}
        initialParams={{
          path: `/groups/${selectedGroup?.slug}/settings/invite`
        }}
      />
      <GroupSettings.Screen
        name='Join Requests'
        component={GroupSettingsWebView}
        initialParams={{
          path: `/groups/${selectedGroup?.slug}/settings/requests`
        }}
      />
      <GroupSettings.Screen
        name='Related Groups'
        component={GroupSettingsWebView}
        initialParams={{
          path: `/groups/${selectedGroup?.slug}/settings/relationships`
        }}
      />
      <GroupSettings.Screen
        name='Export Data'
        component={GroupSettingsWebView}
        initialParams={{
          path: `/groups/${selectedGroup?.slug}/settings/export`
        }}
      />
      <GroupSettings.Screen
        name='Delete'
        component={GroupSettingsWebView}
        initialParams={{
          path: `/groups/${selectedGroup?.slug}/settings/delete`
        }}
      />
    </GroupSettings.Navigator>
  )
}

const styles = {
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
