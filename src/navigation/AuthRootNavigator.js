
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import OneSignal from 'react-native-onesignal'
import { ModalHeader } from 'navigation/headers'
import { modalScreenName } from './linking/helpers'
import { white } from 'style/colors'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import { useNavigation, useRoute } from '@react-navigation/native'
import registerDevice from 'store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import getReturnToOnAuthPath from 'store/selectors/getReturnToOnAuthPath'
import { navigateToLinkingPath } from 'navigation/linking'
// Screens
import DrawerNavigator from 'navigation/DrawerNavigator'
import CreateGroupTabsNavigator from 'navigation/CreateGroupTabsNavigator'
import PostDetails from 'screens/PostDetails'
import MemberProfile from 'screens/MemberProfile'
import GroupDetail from 'screens/GroupDetail'
import PostEditor from 'screens/PostEditor'
import GroupSettingsTabsNavigator from 'navigation/GroupSettingsTabsNavigator'
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import PendingInvites from 'screens/PendingInvites'
import NotificationsList from 'screens/NotificationsList'
import NotificationSettings from 'screens/NotificationSettings'

const AuthRoot = createStackNavigator()
export default function AuthRootNavigator () {
  const navigation = useNavigation()
  const route = useRoute()
  const dispatch = useDispatch()
  const returnToOnAuthPath = useSelector(getReturnToOnAuthPath)

  useEffect(() => {
    (async function () {
      navigation.navigate('Loading')

      const response = await dispatch(fetchCurrentUser())

      if (!response?.payload?.getData()?.error) {
        const deviceState = await OneSignal.getDeviceState()
        console.log('!!!! deviceState', deviceState)
        if (deviceState?.userId) {
          await dispatch(registerDevice(deviceState?.userId))
          OneSignal.setExternalUserId(response.payload?.getData()?.me?.id)
          // Prompt for push on iOS
          OneSignal.promptForPushNotificationsWithUserResponse(() => {})
        } else {
          console.log('Note: Not registering to OneSignal for push notifications. OneSignal did not successfully retrieve a userId')
        }
      }

      if (route?.params?.initialURL) {
        navigateToLinkingPath(route?.params?.initialURL)
      } else if (returnToOnAuthPath) {
        dispatch(setReturnToOnAuthPath())
        navigateToLinkingPath(returnToOnAuthPath)
      } else {
        navigation.navigate('Home Tab', { screen: 'Feed' })
      }
    }())
  }, [])

  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white }
    }
  }

  return (
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
          name={modalScreenName('Group Detail')} component={GroupDetail}
          options={{ title: 'Group Details' }}
        />
        <AuthRoot.Screen name='Edit Post' component={PostEditor} />
        <AuthRoot.Screen name='Group Settings' component={GroupSettingsTabsNavigator} />
        {/* Not used anymore */}
        <AuthRoot.Screen name='Edit Your Skills' component={MemberSkillEditor} />
        <AuthRoot.Screen name='Pending Invites' component={PendingInvites} />
        <AuthRoot.Screen name={modalScreenName('Notifications')} component={NotificationsList} />
        <AuthRoot.Screen name='Notification Settings' component={NotificationSettings} />
      </AuthRoot.Group>
    </AuthRoot.Navigator>
  )
}