import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import { NavigationActions } from 'react-navigation'
import changeCommunity from '../../store/actions/changeCommunity'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getNavigationParam from '../../store/selectors/getNavigationParam'
import { useInvitation } from './JoinCommunity.store'

export function goToCommunityFromRoot (communityIdParam, defaultCommunityId, navigation) {
  const communityId = communityIdParam || defaultCommunityId
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
    },
    goToCommunity: communityId =>
      goToCommunityFromRoot(communityId, currentCommunityId, props.navigation)
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    dispatch,
    useInvitation: (user, invitationCodes) =>
      dispatch(useInvitation(user, invitationCodes)),
    goToCommunity: (communityId, defaultCommunityId) =>
      dispatch(goToCommunityFromRoot(communityId, defaultCommunityId, navigation))
  }
}

export function handleJoinCommunity (stateProps, dispatchProps) {
  const { currentUser, invitationCodes } = stateProps
  const { useInvitation, goToCommunity } = dispatchProps
  const getCommunityId = get('payload.data.useInvitation.membership.community.id')

  return useInvitation(currentUser, invitationCodes)
  .then(result => {
    const communityId = getCommunityId(result)
    communityId && goToCommunity(communityId)
  })
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { goToCommunity } = dispatchProps
  const { currentCommunityId } = stateProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    useInvitation: () => handleJoinCommunity(stateProps, dispatchProps),
    goToCommunity: communityId => goToCommunity(communityId, currentCommunityId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
