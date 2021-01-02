import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import makeGoToCommunity from 'store/actions/makeGoToCommunity'
import getRouteParam from 'store/selectors/getRouteParam'
import { checkInvitation, useInvitation } from './JoinCommunity.store'

export function mapStateToProps (state, props) {
  console.log('!!!!!!!!! JoinCommunity:', props.route.params)
  const { navigation } = props
  const signedIn = state.session?.signedIn

  return {
    signedIn,
    currentUser: getMe(state),
    invitationCodes: {
      invitationToken: getRouteParam('token', props.route) ||
        getRouteParam('invitationToken', props.route),
      accessCode: getRouteParam('accessCode', props.route)
    },
    navToSignup: () => navigation.navigate('Signup'),
    navToInviteExpired: () => navigation.navigate('InviteExpired'),
    // TODO: Should be to Login if not logged-in
    goToHome: () => navigation.navigate('Home', { screen: 'Home' })
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    goToCommunity: makeGoToCommunity(dispatch, navigation),
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

  return () => {
    return checkInvitation(invitationCodes)
      .then(result => {
        const isValidInvite = getInviteValid(result)
        // NOTE: Not currently clearing the entryUrl on a failed check
        // such that join will still be tried upon login. If the invite code
        // is invalid (not just already used) then the user will be forwarded
        // to the community associated with the already claimed invite.
        isValidInvite ? navToSignup() : navToInviteExpired()
      })
      .catch(err => {
        console.log('!!! error when checking invite:', err)
        // TODO: Display toast that there was an error with the invite
        return signedIn
          ? goToHome()
          : navToSignup()
      })
    }
}

export function makeJoinCommunity (stateProps, dispatchProps) {
  const { currentUser, invitationCodes, goToHome } = stateProps
  const { useInvitation, goToCommunity } = dispatchProps
  const getCommunityId = get('payload.data.useInvitation.membership.community.id')
  return () =>
    useInvitation(currentUser?.id, invitationCodes)
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
