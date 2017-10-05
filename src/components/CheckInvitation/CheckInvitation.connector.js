import { connect } from 'react-redux'
import { isNil } from 'lodash'
import {
   getValidInvite, checkInvitation, CHECK_INVITATION
} from './CheckInvitation.store'
import { setInvitationCodes } from '../JoinCommunity/JoinCommunity.store'
import getNavigationParam from '../../store/selectors/getNavigationParam'

export function mapStateToProps (state, props) {
  const isValidInvite = getValidInvite(state)
  const invitationCheckPending = props.invitationCheckPending || state.pending[CHECK_INVITATION]
  const invitationCodes = {
    invitationToken: getNavigationParam('invitationToken', props),
    accessCode: getNavigationParam('accessCode', props)
  }
  console.log('!!! CheckInvitation props:', props)
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
