import { connect } from 'react-redux'
import {
   getValidInvite,
   createResetGoToNavAction,
   checkInvitation,
   CHECK_INVITATION
} from './CheckInvitation.store'
import { resetEntryURL } from '../SessionCheck/SessionCheck.store'
import getNavigationParam from '../../store/selectors/getNavigationParam'

export function mapStateToProps (state, props) {
  const { navigation } = props
  return {
    pending: state.pending && state.pending[CHECK_INVITATION],
    invitationCodes: {
      invitationToken: getNavigationParam('token', state, props) ||
        getNavigationParam('invitationToken', state, props),
      accessCode: getNavigationParam('accessCode', state, props)
    },
    isValidInvite: getValidInvite(state),
    navToSignup: () => navigation.dispatch(createResetGoToNavAction('Signup')),
    navToInviteExpired: () => navigation.navigate('InviteExpire')
  }
}

export const mapDispatchToProps = {
  checkInvitation,
  resetEntryURL
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    checkInvitation: () => dispatchProps.checkInvitation(stateProps.invitationCodes)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
