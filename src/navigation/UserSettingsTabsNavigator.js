import React, { useLayoutEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { isIOS } from 'util/platform'
import ModalHeader from 'navigation/headers/ModalHeader'
import { alabaster, capeCod, rhino, rhino30, rhino40 } from 'style/colors'
import logout from 'store/actions/logout'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import UserSettingsWebView from 'screens/UserSettingsWebView'
import BlockedUsers from 'screens/BlockedUsers'
import LocaleSelector from 'components/LocaleSelector/LocaleSelector'
import { useTranslation } from 'react-i18next'

const UserSettings = createMaterialTopTabNavigator()
export default function UserSettingsTabsNavigator ({ navigation, route }) {
  const initialURL = useSelector(state => state.initialURL)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigatorProps = {
    screenOptions: {
      animationEnabled: !initialURL,
      lazy: true,
      tabBarActiveTintColor: rhino,
      tabBarInactiveTintColor: rhino40,
      tabBarIndicatorStyle: {
        backgroundColor: 'transparent'
      },
      tabBarLabelStyle: {
        fontFamily: 'Circular-Bold',
        fontSize: 14,
        textTransform: 'none'
      },
      tabBarScrollEnabled: true,
      tabBarStyle: styles.tabBarStyle,
      swipeEnabled: false
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerShown: true,
      headerStyle: { backgroundColor: capeCod },
      headerTitleStyle: { color: rhino30 },
      header: headerProps => (
        <ModalHeader
          headerTransparent={false}
          {...headerProps}
          // Hides "X button
          headerLeft={() => (<LocaleSelector small dark />)}
          // // Bring the below back while hiding `TabBar`
          // // to force reload of User after settings changed:
          // headerLeftConfirm={true}
          // headerLeftCloseIcon={false}
          // headerLeftOnPress={() => {
          //   dispatch(fetchCurrentUser())
          //   navigation.navigate('Home Tab')
          // }}
          // headerRight={()=> <Button text="Logout"></Button>}
          headerRightButtonLabel='Logout'
          headerRightButtonOnPress={() => confirmDiscardChanges({
            title: '',
            confirmationMessage: 'Are you sure you want to logout?',
            continueButtonText: 'Cancel',
            disgardButtonText: 'Yes',
            onDiscard: async () => dispatch(logout()),
            t
          })}
          headerRightButtonStyle={{ color: alabaster }}
        />
      )
    })
  }, [navigation, route])

  return (
    <UserSettings.Navigator {...navigatorProps}>
      <UserSettings.Screen
        name='Edit Profile'
        component={UserSettingsWebView}
        initialParams={{
          path: '/settings'
        }}
      />
      <UserSettings.Screen
        name='Afflilations'
        component={UserSettingsWebView}
        initialParams={{
          path: '/settings/groups'
        }}
      />
      <UserSettings.Screen
        name='Invites &amp; Requests'
        component={UserSettingsWebView}
        initialParams={{
          path: '/settings/invitations'
        }}
      />
      <UserSettings.Screen
        name='Notifications'
        component={UserSettingsWebView}
        initialParams={{
          path: '/settings/notifications'
        }}
      />
      <UserSettings.Screen
        name='Account'
        component={UserSettingsWebView}
        initialParams={{
          path: '/settings/account'
        }}
      />
      <UserSettings.Screen
        name='Saved Searches'
        component={UserSettingsWebView}
        initialParams={{
          path: '/settings/saved-searches'
        }}
      />
      <UserSettings.Screen
        name='Blocked Users'
        component={BlockedUsers}
      />
      <UserSettings.Screen
        name='Terms & Privacy'
        component={UserSettingsWebView}
        initialParams={{
          uri: 'https://hylo-landing.surge.sh/terms'
        }}
      />
    </UserSettings.Navigator>
  )
}

const styles = {
  tabBarStyle: (
    isIOS
      ? {
          display: 'flex',
          backgroundColor: alabaster
        }
      : {
          display: 'flex',
          backgroundColor: alabaster,
          borderTopWidth: StyleSheet.hairlineWidth
        }
  )
}
