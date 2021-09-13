import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash/fp'
import { useNavigationContainerRef } from '@react-navigation/native'
import LoadingScreen from 'screens/LoadingScreen'
import getSignedIn from 'store/selectors/getSignedIn'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import { checkInvitation as checkInvitationAction, useInvitation } from './JoinGroup.store'

export default function JoinGroup ({
  route,
  navigation
}) {
  const dispatch = useDispatch()
  const signedIn = useSelector(getSignedIn)
  const currentUser = useSelector(getMe)
  const goToGroup = makeGoToGroup(navigation, dispatch, false)
  const navToInviteExpired = () => navigation?.navigate('InviteExpired')
  const invitationCodes = {
    invitationToken: getRouteParam('token', route) ||
      getRouteParam('invitationToken', route),
    accessCode: getRouteParam('accessCode', route)
  }
  const navigationRef = useNavigationContainerRef()

  useEffect(() => { 
    const checkInviteAndJoin = async () => {
      if (!signedIn) return navigation?.navigate('Login')
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
            : navigation?.navigate('Home Tab')
        } else {
          navigation?.navigate('Home Tab') // TODO: navToInviteExpired()
        }
      } catch (err) {
        // TODO: Display toast that there was an error with the invite
        console.log('!!! error when checking invite or joining group:', err)
        navigation?.navigate('Home Tab')
      }
    }

    checkInviteAndJoin()
  }, [])

  return <LoadingScreen />
}
