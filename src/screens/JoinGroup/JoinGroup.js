import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash/fp'
import LoadingScreen from 'screens/LoadingScreen'
import getSignedIn from 'store/selectors/getSignedIn'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import { navigate } from 'navigation/RootNavigation'
import { checkInvitation as checkInvitationAction, useInvitation } from './JoinGroup.store'

export default function JoinGroup ({
  route,
  navigation
}) {
  const dispatch = useDispatch()
  const signedIn = useSelector(getSignedIn)
  const currentUser = useSelector(getMe)
  const goToGroup = makeGoToGroup(false)
  const navToInviteExpired = () => navigation.navigate('InviteExpired')
  const invitationCodes = {
    invitationToken: getRouteParam('token', route) ||
      getRouteParam('invitationToken', route),
    accessCode: getRouteParam('accessCode', route)
  }

  useEffect(() => { 
    const checkInviteAndJoin = async () => {
      if (!signedIn) return navigate('Login')
      try {
        const checkInviteResult = await dispatch(checkInvitationAction(invitationCodes))
        const getInviteValid = get('payload.data.checkInvitation.valid')
        const inviteValid = getInviteValid(checkInviteResult)
  
        if (inviteValid) {
          const joinResult = await dispatch(useInvitation(currentUser.id, invitationCodes))
          const getgroupId = get('payload.data.useInvitation.membership.group.id')
          const groupId = getgroupId(joinResult)
          groupId
            ? goToGroup(groupId)
            : navigate('Home')
        } else {
          navigate('Home') // TODO: navToInviteExpired()
        }
      } catch (err) {
        // TODO: Display toast that there was an error with the invite
        console.log('!!! error when checking invite or joining group:', err)
        navigate('Home')
      }
    }

    checkInviteAndJoin()
  }, [])

  return <LoadingScreen />
}
