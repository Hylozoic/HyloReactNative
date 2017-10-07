import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import { NavigationActions } from 'react-navigation'
import {
  getNewMembership,
  useInvitation,
  resetInvitationCodes
} from './JoinCommunity.store'
import getNavigationParam from '../../store/selectors/getNavigationParam'

export function mapStateToProps (state, props) {
  const newMembership = getNewMembership(state)
  return {
    currentUser: getMe(state),
    invitationCodes: {
      invitationToken: getNavigationParam('token', state, props) ||
        getNavigationParam('invitationToken', state, props),
      accessCode: getNavigationParam('accessCode', state, props)
    },
    communityId: get('community.id', newMembership)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    useInvitation: (user, invitationCodes) => dispatch(useInvitation(user, invitationCodes)),
    resetInvitationCodes: () => dispatch(resetInvitationCodes())
  }
}

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

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    useInvitation: () => dispatchProps.useInvitation(stateProps.currentUser, stateProps.invitationCodes),
    goToCommunity: () => goToCommunityFromRoot(stateProps.communityId, ownProps.navigation)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
