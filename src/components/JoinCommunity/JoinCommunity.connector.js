import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import { NavigationActions } from 'react-navigation'
import { useInvitation } from './JoinCommunity.store'
import getNavigationParam from '../../store/selectors/getNavigationParam'

export function goToCommunityFromRoot (communityId, navigation) {
  const action = NavigationActions.navigate({
    routeName: 'Main',
    action: {
      routeName: 'Feed',
      params: {communityId}
    }
  })
  return navigation.dispatch(action)
}

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    invitationCodes: {
      invitationToken: getNavigationParam('token', state, props) ||
        getNavigationParam('invitationToken', state, props),
      accessCode: getNavigationParam('accessCode', state, props)
    },
    goToCommunity: (communityId) => goToCommunityFromRoot(communityId, props.navigation)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    useInvitation: (user, invitationCodes) => dispatch(useInvitation(user, invitationCodes))
  }
}

export function handleJoinCommunity (stateProps, dispatchProps) {
  const { goToCommunity, currentUser, invitationCodes } = stateProps
  const { useInvitation } = dispatchProps
  const getCommunityId = get('payload.data.useInvitation.membership.community.id')

  return useInvitation(currentUser, invitationCodes)
  .then(result => {
    const communityId = getCommunityId(result)
    communityId && goToCommunity(communityId)
  })
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    useInvitation: () => handleJoinCommunity(stateProps, dispatchProps)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
