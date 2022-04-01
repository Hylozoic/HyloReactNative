import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { navigationRef } from 'navigation/linking/helpers'
import RNBootSplash from 'react-native-bootsplash'
import RootNavigator from 'navigation/RootNavigator'
import OneSignal from 'react-native-onesignal'
import { register as registerOneSignal } from 'util/onesignal'
import customLinking, {
  INITIAL_NAV_STATE,
  navigateToLinkingPath
} from 'navigation/linking'
import registerDevice from 'store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import selectGroup from 'store/actions/selectGroup'
import getMe from 'store/selectors/getMe'
import { getLastViewedGroup } from 'store/models/Me'
import { getAuthorized } from 'store/selectors/getSignupState'
import getReturnToPath from 'store/selectors/getReturnToPath'
import setReturnToPath from 'store/actions/setReturnToPath'
import SocketListener from 'components/SocketListener'
import LoadingScreen from 'screens/LoadingScreen'

export default function RootView () {
  const dispatch = useDispatch()
  const [navIsReady, setNavIsReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const returnToPath = useSelector(getReturnToPath)
  const currentUser = useSelector(getMe)
  const isAuthorized = useSelector(getAuthorized)

  // Handle Push Notifications opened
  useEffect(() => OneSignal.setNotificationOpenedHandler(({ notification }) => {
    const path = notification?.additionalData?.path
    setReturnToPath(path)
  }), [])

  // Handle returnToPath
  useEffect(() => {
    if (navIsReady && returnToPath) {
      navigateToLinkingPath(returnToPath, isAuthorized)
    }
  }, [navIsReady, isAuthorized, returnToPath])

  // Handle loading of currentUser if already "signedIn" via Login screen
  // or on app launch when signedIn status is not yet known
  useEffect(() => {
    const loadCurrentUserSessionAsync = async () => {
      const currentUserRaw = await dispatch(fetchCurrentUser())
      if (currentUserRaw?.payload?.data?.me) {
        const memberships = currentUserRaw?.payload?.data?.me?.memberships
        const lastViewedgroupId = getLastViewedGroup(memberships)?.id
        await dispatch(selectGroup(lastViewedgroupId))
        await dispatch(registerOneSignal({ registerDevice }))
        // Prompt for push on iOS
        OneSignal.promptForPushNotificationsWithUserResponse(() => {})
      }
      setLoading(false)
    }

    if (!currentUser) {
      setLoading(true)
      loadCurrentUserSessionAsync()
    } else {
      setLoading(false)
    }
  }, [dispatch, currentUser])

  if (loading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <View style={styles.rootContainer}>
      {isAuthorized && (
        <SocketListener />
      )}
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        initialState={isAuthorized ? INITIAL_NAV_STATE : null}
        onReady={() => {
          setNavIsReady(true)
          !loading && RNBootSplash.hide()
        }}
        // NOTE: Uncomment below to get a map of the state
        // onStateChange={state => console.log('!!! onStateChange:', state.routes)}
      >
        <RootNavigator isAuthorized={isAuthorized} />
      </NavigationContainer>
    </View>
  )
}

const styles = {
  rootContainer: {
    flex: 1
  }
}

// NOTE: Another option for handling initial state:
// if (!initialURL && isAuthorized) {
//   navigationRef.current?.navigate('Drawer', { screen:'Tabs', params: { screen: 'Home Tab', params: { screen: 'Feed' } } })
// }
