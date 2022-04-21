
import React, { useCallback, useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { find, get } from 'lodash/fp'
import { ModalHeader } from 'navigation/headers'
import { isModalScreen, modalScreenName } from './linking/helpers'
import { white } from 'style/colors'
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
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { navigateToLinkingPath } from './linking'
import { useDispatch, useSelector } from 'react-redux'
import registerDevice from 'store/actions/registerDevice'
import OneSignal from 'react-native-onesignal'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import setReturnToOnAuthPath from 'store/actions/setReturnToOnAuthPath'
import getReturnToOnAuthPath from 'store/selectors/getReturnToOnAuthPath'
import selectGroupAction from 'store/actions/selectGroup'
import { isContextGroup } from 'store/models/Group'
import LoadingScreen from 'screens/LoadingScreen'
import getGroup from 'store/selectors/getGroup'
import { PUBLIC_GROUP_ID } from 'store/models/Group'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'
import getCurrentGroup from 'store/selectors/getCurrentGroup'


const AuthRoot = createStackNavigator()
export default function AuthRootNavigator () {
  const route = useRoute()
  const routeParams = route?.params
  const isModal = isModalScreen(route?.name)
  const groupSlugRouteParam = get('params.params.params.params.groupSlug', routeParams)

  const groupFromGroupSlugRouteParam = useSelector(state => getGroup(state, { slug: groupSlugRouteParam }))
  const currentlySelectedGroup = useSelector(getCurrentGroup)
  const lastViewedGroup = useSelector(getLastViewedGroup)
  const returnToOnAuthPath = useSelector(getReturnToOnAuthPath)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      (async function () {
        const response = await dispatch(fetchCurrentUser())

        setLoading(false)

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
      })()
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        if (returnToOnAuthPath) {
          dispatch(setReturnToOnAuthPath())
          navigateToLinkingPath(returnToOnAuthPath, true)
        } else if (!isModal && groupFromGroupSlugRouteParam?.id) {
          dispatch(selectGroupAction(groupFromGroupSlugRouteParam?.id))
          navigateToLinkingPath(`groups/${groupFromGroupSlugRouteParam?.id}`)
        } else if (!currentlySelectedGroup?.id) {
          dispatch(selectGroupAction(lastViewedGroup?.id || PUBLIC_GROUP_ID))
          navigateToLinkingPath(`groups/${lastViewedGroup?.id || PUBLIC_GROUP_ID}`)
        }
      }
    }, [loading, isModal, returnToOnAuthPath, groupFromGroupSlugRouteParam?.id, currentlySelectedGroup?.id, lastViewedGroup?.id, dispatch])
  )

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

// useFocusEffect(
//   useCallback(() => {
//     if (currentGroup?.slug) navigateToLinkingPath(`/groups/${currentGroup.slug})`)
//   }, [currentGroup])
// )
