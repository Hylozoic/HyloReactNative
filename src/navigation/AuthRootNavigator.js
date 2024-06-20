import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { modalScreenName } from 'hooks/useIsModalScreen'
import ModalHeader from 'navigation/headers/ModalHeader'
import CreateGroupTabsNavigator from 'navigation/CreateGroupTabsNavigator'
import DrawerNavigator from 'navigation/DrawerNavigator'
import GroupExploreWebView from 'screens/GroupExploreWebView'
import GroupSettingsTabsNavigator from 'navigation/GroupSettingsTabsNavigator'
import LoadingScreen from 'screens/LoadingScreen'
import MemberProfile from 'screens/MemberProfile'
import PostDetails from 'screens/PostDetails'
import PostEditor from 'screens/PostEditor'
import NotificationsList from 'screens/NotificationsList'
import Thread from 'screens/Thread'
import { white } from 'style/colors'
import { HyloHTMLConfigProvider } from 'components/HyloHTML/HyloHTML'
import { useDispatch } from 'react-redux'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import OneSignal from 'react-native-onesignal'
import registerDevice from 'store/actions/registerDevice'
import i18n from '../../i18n'
import { fetchNotifications, updateNewNotificationCount } from 'screens/NotificationsList/NotificationsList.store'

const AuthRoot = createStackNavigator()
export default function AuthRootNavigator () {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async function () {
      const response = await dispatch(fetchCurrentUser())

      if (!response.payload?.getData()?.error) {
        const deviceState = await OneSignal.getDeviceState()

        const locale = response.payload?.getData().settings?.locale || 'en'
        i18n.changeLanguage(locale)

        if (deviceState?.userId) {
          await dispatch(registerDevice(deviceState?.userId))
          OneSignal.setExternalUserId(response.payload?.getData()?.me?.id)
          // Prompt for push notifications (iOS only)
          OneSignal.promptForPushNotificationsWithUserResponse(() => {})
        } else {
          console.warn('Not registering to OneSignal for push notifications. OneSignal did not successfully retrieve a userId')
        }
      }

      setLoading(false)
    })()
    dispatch(fetchNotifications())
    dispatch(updateNewNotificationCount())
  }, [])

  if (loading) return <LoadingScreen />

  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white }
    }
  }

  return (
    <HyloHTMLConfigProvider>
      <AuthRoot.Navigator {...navigatorProps}>
        <AuthRoot.Screen name='Drawer' component={DrawerNavigator} options={{ headerShown: false }} />
        <AuthRoot.Screen
          name='Create Group' component={CreateGroupTabsNavigator}
          options={{ headerShown: false }}
        />
        <AuthRoot.Group screenOptions={{ presentation: 'modal', header: ModalHeader }}>
          <AuthRoot.Screen
            name={modalScreenName('Post Details')} component={PostDetails}
            options={{ title: 'Post Details' }}
          />
          <AuthRoot.Screen
            name={modalScreenName('Member')} component={MemberProfile}
            options={{ title: 'Member' }}
          />
          <AuthRoot.Screen
            name={modalScreenName('Group Explore')} component={GroupExploreWebView}
            options={{ title: 'Explore' }}
          />
          <AuthRoot.Screen name='Edit Post' component={PostEditor} options={{ headerShown: false }} />
          <AuthRoot.Screen name='Group Settings' component={GroupSettingsTabsNavigator} />
          <AuthRoot.Screen name={modalScreenName('Thread')} component={Thread} />
          <AuthRoot.Screen name={modalScreenName('Notifications')} component={NotificationsList} />
        </AuthRoot.Group>
      </AuthRoot.Navigator>
    </HyloHTMLConfigProvider>
  )
}
