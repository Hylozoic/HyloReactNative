import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { navigationRef } from 'navigation/linking/helpers'
import RNBootSplash from 'react-native-bootsplash'
import RootNavigator from 'navigation/RootNavigator'
import OneSignal from 'react-native-onesignal'
import customLinking, {
  INITIAL_NAV_STATE,
  navigateToLinkingPath
} from 'navigation/linking'

import { FETCH_CURRENT_USER } from 'store/constants'
import { register as registerOneSignal } from 'util/onesignal'
import registerDevice from 'store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import selectGroup from 'store/actions/selectGroup'
import getMe from 'store/selectors/getMe'
import { getLastViewedGroup } from 'store/models/Me'
import getSignedIn from 'store/selectors/getSignedIn'
import getSignupInProgress from 'store/selectors/getSignupInProgress'
import getReturnToPath from 'store/selectors/getReturnToPath'
import setReturnToPath from 'store/actions/setReturnToPath'
import SocketListener from 'components/SocketListener'
import LoadingScreen from 'screens/LoadingScreen'

export const SIGNUP_STATE = {
  EmailValidation: 'EmailValidation',
  AccountDetails: 'AccountDetails',
  ProfileDetails: 'ProfileDetails',
  Complete: 'Complete'
}

export function getSignupState (currentUser) {
  if (!currentUser) throw new Error('currentUser must be provided')

  const { emailValidated, hasRegistered, settings: { signupInProgress } } = currentUser

  if (!emailValidated) return SIGNUP_STATE.EmailValidation
  if (!hasRegistered) return SIGNUP_STATE.AccountDetails
  if (signupInProgress) return SIGNUP_STATE.ProfileDetails

  return SIGNUP_STATE.Complete
}

export default function RootView () {
  const [navIsReady, setNavIsReady] = useState(false)
  const dispatch = useDispatch()

  const currentUser = useSelector(getMe)
  const signedIn = useSelector(getSignedIn)
  const signupInProgress = useSelector(getSignupInProgress)
  const returnToPath = useSelector(getReturnToPath)
  const loading = useSelector(state => state.pending[FETCH_CURRENT_USER])

  const fullyAuthorized = currentUser && getSignupState(currentUser) === SIGNUP_STATE.Complete

  // Handle Push Notifications opened
  useEffect(() => OneSignal.setNotificationOpenedHandler(({ notification }) => {
    const path = notification?.additionalData?.path
    setReturnToPath(path)
  }), [])

  // Handle returnToPath
  useEffect(() => {
    if (navIsReady && returnToPath) {
      navigateToLinkingPath(returnToPath, fullyAuthorized)
    }
  }, [navIsReady, fullyAuthorized, returnToPath])

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
    }

    if (!signedIn || (signedIn && !currentUser)) {
      loadCurrentUserSessionAsync()
    }
  }, [dispatch, currentUser, signedIn])

  if (loading && !signupInProgress) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <View style={styles.rootContainer}>
      {fullyAuthorized && (
        <SocketListener />
      )}
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        initialState={fullyAuthorized ? INITIAL_NAV_STATE : null}
        onReady={() => {
          setNavIsReady(true)
          !loading && RNBootSplash.hide()
        }}
        // NOTE: Uncomment below to get a map of the state
        // onStateChange={state => console.log('!!! onStateChange:', state.routes)}
      >
        <RootNavigator fullyAuthorized={fullyAuthorized} />
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
// if (!initialURL && fullyAuthorized) {
//   navigationRef.current?.navigate('Drawer', { screen:'Tabs', params: { screen: 'Home Tab', params: { screen: 'Feed' } } })
// }
