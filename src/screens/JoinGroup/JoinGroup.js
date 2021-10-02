import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash/fp'
import LoadingScreen from 'screens/LoadingScreen'
import getSignedIn from 'store/selectors/getSignedIn'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import getRouteParam from 'store/selectors/getRouteParam'
import getMemberships from 'store/selectors/getMemberships'
import { checkInvitation as checkInvitationAction, useInvitation } from './JoinGroup.store'

export default function JoinGroup ({
  route,
  navigation
}) {
  const dispatch = useDispatch()
  const signedIn = useSelector(getSignedIn)
  const memberships = useSelector(getMemberships)
  const goToGroup = makeGoToGroup(navigation, dispatch, false)
  const invitationCodes = {
    invitationToken: getRouteParam('token', route),
    accessCode: getRouteParam('accessCode', route)
  }

  useEffect(() => { 
    const checkInviteAndJoin = async () => {
      if (!signedIn) return navigation?.navigate('Login')
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
