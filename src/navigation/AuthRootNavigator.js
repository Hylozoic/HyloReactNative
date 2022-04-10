
import 'react-native-gesture-handler' // probably not necessary as already included in index.js
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import OneSignal from 'react-native-onesignal'
import { ModalHeader } from 'navigation/headers'
import { modalScreenName } from './linking/helpers'
import { white } from 'style/colors'
import registerDevice from 'store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getReturnToPath from 'store/selectors/getReturnToPath'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'
import { register as registerOneSignal } from 'util/onesignal'
import { navigateToLinkingPathInApp } from 'navigation/linking'
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
import LoadingScreen from 'screens/LoadingScreen'

const AuthRoot = createStackNavigator()
export default function AuthRootNavigator () {

  const dispatch = useDispatch()
  const returnToPath = useSelector(getReturnToPath)
  const currentGroup = useSelector(getCurrentGroup)
  const lastViewedGroup = useSelector(getLastViewedGroup)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async function () {
      const response = await dispatch(fetchCurrentUser())
      if (!response?.payload?.getData()?.error) {
        await registerOneSignal({ registerDevice })
        // Prompt for push on iOS
        OneSignal.promptForPushNotificationsWithUserResponse(() => {})
      }
      setLoading(false)
    }())
  }, [])

  // useEffect(() => {
  //   if (!loading && currentGroup?.id !== lastViewedGroup?.id) {
  //     dispatch(selectGroup(lastViewedGroup))
  //   }
  // }, [dispatch, currentGroup, lastViewedGroup, loading])

  if (loading) {
    return <LoadingScreen />
  }

  if (returnToPath) navigateToLinkingPathInApp(returnToPath, true)

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
