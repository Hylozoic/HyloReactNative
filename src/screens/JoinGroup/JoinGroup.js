import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute, useLinkTo } from '@react-navigation/native'
import { every, isEmpty } from 'lodash/fp'
import setReturnToPath from 'store/actions/setReturnToPath'
import getRouteParam from 'store/selectors/getRouteParam'
import { getSignupComplete } from 'store/selectors/getAuthState'
import { navigateToLinkingPathInApp } from 'navigation/linking'
import useInvitation from 'store/actions/useInvitation'
import checkInvitation from 'store/actions/checkInvitation'
import LoadingScreen from 'screens/LoadingScreen'

export const SIGNUP_PATH = '/signup'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default function JoinGroup (props) {
  const navigation = useNavigation()
  const route = useRoute()
  const dispatch = useDispatch()
  const signupComplete = useSelector(getSignupComplete)

  // Probably should use `useFocusEffect`
  useEffect(() => {
    (async function () {
      try {
        const invitationTokenAndCode = {
          invitationToken: getRouteParam('token', route),
          accessCode: getRouteParam('accessCode', route)
        }

        if (every(isEmpty, invitationTokenAndCode)) {
          throw new Error('Please provide either a `token` query string parameter or `accessCode` route param')
        }

        if (signupComplete) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const result = await dispatch(useInvitation(invitationTokenAndCode))
          const newMembership = result?.payload?.getData()?.membership
          const groupSlug = newMembership?.group?.slug

          if (groupSlug) {
            navigateToLinkingPathInApp(`/groups/${groupSlug}`)
          } else {
            throw new Error('Join group was unsuccessful')
          }
        } else {
          const result = await dispatch(checkInvitation(invitationTokenAndCode))
          const isValidInvite = result?.payload?.getData()?.valid

          if (isValidInvite) {
            dispatch(setReturnToPath(route.params?.originalLinkingPath))
            navigateToLinkingPathInApp('/signup?message=Signup or login to join this group.')
            return null
          } else {
            navigateToLinkingPathInApp('/signup?error=invite-expired')
            return null
          }
        }
      } catch (error) {
        console.log('!!! error', error)
        navigation.goBack()
      }
    })()
  }, [])

  return <LoadingScreen />
}
