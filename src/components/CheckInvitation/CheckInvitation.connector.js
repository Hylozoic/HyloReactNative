import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { checkInvitation } from './CheckInvitation.store'
import getNavigationParam from '../../store/selectors/getNavigationParam'
import { resetToRoute } from 'util/navigation'

export function mapStateToProps (state, props) {
  const { navigation } = props
  return {
    invitationCodes: {
      invitationToken: getNavigationParam('token', state, props) ||
        getNavigationParam('invitationToken', state, props),
      accessCode: getNavigationParam('accessCode', state, props)
    },
    navToSignup: () => resetToRoute(navigation, 'Signup'),
    navToInviteExpired: () => resetToRoute(navigation, 'InviteExpired')
  }
}

export const mapDispatchToProps = {checkInvitation}

export function handleCheckInvitation (stateProps, dispatchProps) {
  const { invitationCodes, navToSignup, navToInviteExpired } = stateProps
  const { checkInvitation } = dispatchProps
  const getInviteValid = get('payload.data.checkInvitation.valid')

  return checkInvitation(invitationCodes)
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

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    checkInvitation: () => handleCheckInvitation(stateProps, dispatchProps)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
