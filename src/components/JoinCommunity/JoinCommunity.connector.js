import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import { NavigationActions } from 'react-navigation'
import changeCommunity from '../../store/actions/changeCommunity'
import getNavigationParam from '../../store/selectors/getNavigationParam'
import { useInvitation } from './JoinCommunity.store'

export function goToCommunityFromRoot (dispatch, navigation) {
  return communityId => {
    const action = NavigationActions.navigate({
      routeName: 'Main',
      action: {
        routeName: 'Feed',
        params: {communityId}
      }
    })
    dispatch(changeCommunity(communityId))
    return navigation.dispatch(action)
  }
}

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    invitationCodes: {
      invitationToken: getNavigationParam('token', state, props) ||
        getNavigationParam('invitationToken', state, props),
      accessCode: getNavigationParam('accessCode', state, props)
    }
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    useInvitation: (user, invitationCodes) =>
      dispatch(useInvitation(user, invitationCodes)),
    goToCommunity: (communityId) =>
      goToCommunityFromRoot(dispatch, navigation)(communityId)
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
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    useInvitation: () => handleJoinCommunity(stateProps, dispatchProps)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
