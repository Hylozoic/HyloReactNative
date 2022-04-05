import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash/fp'
import LoadingScreen from 'screens/LoadingScreen'
import { getAuthorized } from 'store/selectors/getAuthState'
import getRouteParam from 'store/selectors/getRouteParam'
import getMemberships from 'store/selectors/getMemberships'
import { checkInvitation as checkInvitationAction, useInvitation } from './JoinGroup.store'

export default function JoinGroup ({
  route,
  navigation
}) {
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getAuthorized)
  const memberships = useSelector(getMemberships)
  const invitationCodes = {
    invitationToken: getRouteParam('token', route),
    accessCode: getRouteParam('accessCode', route)
  }
  const goToGroup = groupId => navigation?.navigate('Feed', { groupId })

  useEffect(() => {
    const checkInviteAndJoin = async () => {
      if (!isAuthorized) return navigation?.navigate('Login')
      try {
        const checkInviteResult = await dispatch(checkInvitationAction(invitationCodes))
        const getInviteValid = get('payload.data.checkInvitation.valid')
        const inviteValid = getInviteValid(checkInviteResult)

        if (inviteValid) {
          const joinResult = await dispatch(useInvitation(invitationCodes))
          const getGroupId = get('payload.data.useInvitation.membership.group.id')
          const groupId = getGroupId(joinResult)

          groupId
            ? goToGroup(groupId, memberships)
            : navigation?.navigate('Home Tab', { screen: 'Feed'})
        } else {
          navigation?.replace('InviteExpired')
        }
      } catch (err) {
        // TODO: Display toast that there was an error with the invite
        console.log('!!! error when checking invite or joining group:', err)
        navigation?.navigate('Home Tab', { screen: 'Feed'})
      }
    }

    checkInviteAndJoin()
  }, [])

  return (
    <LoadingScreen />
  )
}

// Reference implementation from Web:
//
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useHistory, Redirect } from 'react-router-dom'
// import { every, isEmpty } from 'lodash/fp'
// import { groupUrl } from 'util/navigation'
// import setReturnToPath from 'store/actions/setReturnToPath'
// import getQuerystringParam from 'store/selectors/getQuerystringParam'
// import getRouteParam from 'store/selectors/getRouteParam'
// import { getSignupComplete } from 'store/selectors/getAuthState'
// import useInvitation from 'store/actions/useInvitation'
// import checkInvitation from 'store/actions/checkInvitation'
// import Loading from 'components/Loading'

// export const SIGNUP_PATH = '/signup'
// export const EXPIRED_INVITE_PATH = '/invite-expired'

// export default function JoinGroup (props) {
//   const history = useHistory()
//   const dispatch = useDispatch()
//   const signupComplete = useSelector(getSignupComplete)
//   const [redirectTo, setRedirectTo] = useState()

//   useEffect(() => {
//     (async function () {
//       try {
//         const invitationTokenAndCode = {
//           invitationToken: getQuerystringParam('token', null, props),
//           accessCode: getRouteParam('accessCode', null, props)
//         }

//         if (every(isEmpty, invitationTokenAndCode)) {
//           throw new Error('Please provide either a `token` query string parameter or `accessCode` route param')
//         }

//         if (signupComplete) {
//           const result = await dispatch(useInvitation(invitationTokenAndCode))
//           const newMembership = result?.payload?.getData()?.membership
//           const groupSlug = newMembership?.group?.slug

//           if (groupSlug) {
//             setRedirectTo(groupUrl(groupSlug, 'explore'))
//           } else {
//             throw new Error('Join group was unsuccessful')
//           }
//         } else {
//           const result = await dispatch(checkInvitation(invitationTokenAndCode))
//           const isValidInvite = result?.payload?.getData()?.valid

//           if (isValidInvite) {
//             dispatch(setReturnToPath(props.location.pathname + props.location.search))
//             setRedirectTo(SIGNUP_PATH)
//           } else {
//             setRedirectTo(EXPIRED_INVITE_PATH)
//           }
//         }
//       } catch (error) {
//         history.goBack()
//       }
//     })()
//   }, [])

//   if (redirectTo) return <Redirect to={redirectTo} />

//   return <Loading />
// }
