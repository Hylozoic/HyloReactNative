
import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { get, isEmpty } from 'lodash/fp'
import OneSignal from 'react-native-onesignal'
import { navigateToLinkingPath } from 'navigation/linking'
import { isModalScreen, modalScreenName } from 'navigation/linking/helpers'
import getGroup from 'store/selectors/getGroup'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { useRoute } from '@react-navigation/native'
import registerDevice from 'store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import getReturnToOnAuthPath from 'store/selectors/getReturnToOnAuthPath'
import selectGroupAction from 'store/actions/selectGroup'
import { ModalHeader } from 'navigation/headers'
import CreateGroupTabsNavigator from 'navigation/CreateGroupTabsNavigator'
import DrawerNavigator from 'navigation/DrawerNavigator'
import GroupDetailWebView from 'screens/GroupDetailWebView'
import LoadingScreen from 'screens/LoadingScreen'
import MemberProfile from 'screens/MemberProfile'
import NewMessage from 'screens/NewMessage'
import PostDetails from 'screens/PostDetails'
import PostEditor from 'screens/PostEditor'
import GroupSettingsTabsNavigator from 'navigation/GroupSettingsTabsNavigator'
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import NotificationsList from 'screens/NotificationsList'
import NotificationSettings from 'screens/NotificationSettings'
import PendingInvites from 'screens/PendingInvites'
import Thread from 'screens/Thread'
import ThreadParticipants from 'screens/ThreadParticipants'
import { white } from 'style/colors'

const AuthRoot = createStackNavigator()
export default function AuthRootNavigator () {
  const route = useRoute()
  const routeParams = route?.params
  const isModal = isModalScreen(route?.name) || isModalScreen(route?.params?.screen)
  // TODO: Replace with a dynamic nested object search or ?
  const groupSlugRouteParam = get('params.params.params.params.groupSlug', routeParams)
  const groupFromGroupSlugRouteParam = useSelector(state => getGroup(state, { slug: groupSlugRouteParam }))
  const currentlySelectedGroup = useSelector(getCurrentGroup)
  const lastViewedGroup = useSelector(getLastViewedGroup)
  const returnToOnAuthPath = useSelector(getReturnToOnAuthPath)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async function () {
      const response = await dispatch(fetchCurrentUser())

      if (!response.payload?.getData()?.error) {
        const deviceState = await OneSignal.getDeviceState()

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
  }, [])

  useEffect(() => {
    (async function () {
      if (!loading) {
        if (!isModal) {
          const groupToSelect = groupFromGroupSlugRouteParam || lastViewedGroup

          if (currentlySelectedGroup?.id !== groupToSelect?.id) {
            dispatch(selectGroupAction(groupToSelect.id))
            await navigateToLinkingPath(`groups/${groupToSelect.slug}`)
          }
        }

        if (!isEmpty(returnToOnAuthPath)) {
          dispatch(setReturnToOnAuthPath())
          navigateToLinkingPath(returnToOnAuthPath)
        }
      }
    })()
  }, [
    loading,
    returnToOnAuthPath,
    isModal,
    groupFromGroupSlugRouteParam,
    groupFromGroupSlugRouteParam?.id,
    currentlySelectedGroup?.id,
    lastViewedGroup,
    lastViewedGroup?.id,
    dispatch
  ])

  const navigatorProps = {
    screenOptions: {
      cardStyle: { backgroundColor: white }
    }
  }

  if (loading) return <LoadingScreen />

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
          name={modalScreenName('Group Detail')} component={GroupDetailWebView}
          options={{ title: 'Group Details' }}
        />
        <AuthRoot.Screen name='Edit Post' component={PostEditor} />
        <AuthRoot.Screen name='Group Settings' component={GroupSettingsTabsNavigator} />
        {/* Not used anymore */}
        <AuthRoot.Screen name='Edit Your Skills' component={MemberSkillEditor} />
        <AuthRoot.Screen
          name={modalScreenName('New Message')} component={NewMessage}
          options={{ title: 'New Message' }}
        />
        <AuthRoot.Screen name={modalScreenName('Thread')} component={Thread} />
        <AuthRoot.Screen
          name={modalScreenName('ThreadParticipants')}
          component={ThreadParticipants}
          options={{
            title: 'Participants'
          }}
        />
        <AuthRoot.Screen name='Pending Invites' component={PendingInvites} />
        <AuthRoot.Screen name={modalScreenName('Notifications')} component={NotificationsList} />
        <AuthRoot.Screen name='Notification Settings' component={NotificationSettings} />
      </AuthRoot.Group>
    </AuthRoot.Navigator>
  )
}
