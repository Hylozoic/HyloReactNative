import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import getMe from '../../store/selectors/getMe'
import { NavigationActions } from 'react-navigation'
import selectCommunity from '../../store/actions/selectCommunity'
import getNavigationParam from '../../store/selectors/getNavigationParam'
import { checkInvitation, useInvitation } from './JoinCommunity.store'
import { resetToRoute, resetToMainRoute } from 'util/navigation'

export function goToCommunity (communityId, navigation) {
  navigation.dispatch(NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Main',
        action: {
          routeName: 'Feed',
          params: {communityId}
        }
      })
    ]
  }))
  return selectCommunity(communityId)
}

export function mapStateToProps (state, props) {
  const { navigation } = props
  return {
    currentUser: getMe(state),
    invitationCodes: {
      invitationToken: getNavigationParam('token', state, props) ||
        getNavigationParam('invitationToken', state, props),
      accessCode: getNavigationParam('accessCode', state, props)
    },
    navToSignup: () => resetToRoute(navigation, 'Signup'),
    navToInviteExpired: () => resetToRoute(navigation, 'InviteExpired'),
    goToHome: () => resetToMainRoute(navigation)
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    goToCommunity: (communityId) =>
      dispatch(goToCommunity(communityId, navigation)),
    ...bindActionCreators({
      checkInvitation,
      useInvitation
    }, dispatch)
  }
}

export function makeCheckInvitation (stateProps, dispatchProps) {
  const { invitationCodes, navToSignup, navToInviteExpired } = stateProps
  const { checkInvitation } = dispatchProps
  const getInviteValid = get('payload.data.checkInvitation.valid')

  return () =>
    checkInvitation(invitationCodes)
    .then(result => {
      const isValidInvite = getInviteValid(result)
      // NOTE: Not currently clearing the entryUrl on a failed check
      // such that join will still be tried upon login. If the invite code
      // is invalid (not just already used) then the user will be forwarded
      // to the community associated with the already claimed invite.
      isValidInvite ? navToSignup() : navToInviteExpired()
    })
    // NOTE: if something fails in the process of checking the
    // invitation the user will be forwarded on to the Signup
    // page given that we don't know if there is an issue (expired)
    // with the invite or if there was just some other issue.
    // SO in this case the user will still be prompted to
    // continue to signup (or login) and JoinCommunity will
    // be tried again upon signing in.
    .catch(err => err && navToSignup())
}

export function makeJoinCommunity (stateProps, dispatchProps) {
  const { currentUser, invitationCodes } = stateProps
  const { useInvitation, goToCommunity, goToHome } = dispatchProps
  const getCommunityId = get('payload.data.useInvitation.membership.community.id')
  return () =>
    useInvitation(currentUser, invitationCodes)
    .then(result => {
      const communityId = getCommunityId(result)
      communityId ? goToCommunity(communityId) : goToHome()
    })
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const checkOrUseInvitation = stateProps.currentUser
    ? makeJoinCommunity(stateProps, dispatchProps)
    : makeCheckInvitation(stateProps, dispatchProps)

  return {
    checkOrUseInvitation
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
