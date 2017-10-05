import { connect } from 'react-redux'
import { isNil } from 'lodash'
import {
   getValidInvite, checkInvitation, CHECK_INVITATION
} from './CheckInvitation.store'
import { setInvitationCodes } from '../JoinCommunity/JoinCommunity.store'
import getNavigationParam from '../../store/selectors/getNavigationParam'

export function mapStateToProps (state, props) {
  const isValidInvite = getValidInvite(state)
  const invitationCheckPending = state.pending && state.pending[CHECK_INVITATION]
  const invitationCodes = {
    invitationToken: getNavigationParam('token', state, props) ||
      getNavigationParam('invitationToken', state, props),
    accessCode: getNavigationParam('accessCode', state, props)
  }
  return {
    invitationCodes,
    invitationCheckPending,
    hasCheckedValidInvite: !isNil(isValidInvite),
    isValidInvite
  }
}

export const mapDispatchToProps = {
  checkInvitation,
  setInvitationCodes
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    checkInvitation: () => dispatchProps.checkInvitation(stateProps.invitationCodes),
    setInvitationCodes: () => dispatchProps.setInvitationCodes(stateProps.invitationCodes)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
