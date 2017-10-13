import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import { NavigationActions } from 'react-navigation'
import changeCommunity from '../../store/actions/changeCommunity'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getNavigationParam from '../../store/selectors/getNavigationParam'
import { useInvitation } from './JoinCommunity.store'

export function goToCommunityFromRoot (communityId, navigation) {
  const action = NavigationActions.navigate({
    routeName: 'Main',
    action: {
      routeName: 'Feed',
      params: {communityId}
    }
  })
  navigation.dispatch(action)
  return changeCommunity(communityId)
}

export function mapStateToProps (state, props) {
  const currentCommunityId = getCurrentCommunityId(state, props)
  return {
    currentUser: getMe(state),
    currentCommunityId,
    invitationCodes: {
      invitationToken: getNavigationParam('token', state, props) ||
        getNavigationParam('invitationToken', state, props),
      accessCode: getNavigationParam('accessCode', state, props)
    }
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    dispatch,
    useInvitation: (user, invitationCodes) =>
      dispatch(useInvitation(user, invitationCodes)),
    goToCommunity: (communityId) =>
      dispatch(goToCommunityFromRoot(communityId, navigation))
  }
}

export function handleJoinCommunity (stateProps, dispatchProps) {
  const { currentUser, currentCommunityId, invitationCodes } = stateProps
  const { useInvitation, goToCommunity } = dispatchProps
  const getCommunityId = get('payload.data.useInvitation.membership.community.id')

  return useInvitation(currentUser, invitationCodes)
  .then(result => {
    const communityId = getCommunityId(result)
    goToCommunity(communityId || currentCommunityId)
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
