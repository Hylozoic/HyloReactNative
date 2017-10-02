import { connect } from 'react-redux'
import { isNil } from 'lodash'
import {
   getValidInvite, checkInvitation, CHECK_INVITATION
} from './CheckInvitation.store'

export function mapStateToProps (state, props) {
  const isValidInvite = getValidInvite(state)
  const invitationCheckPending = props.invitationCheckPending || state.pending[CHECK_INVITATION]

  return {
    invitationCheckPending,
    hasCheckedValidInvite: !isNil(isValidInvite),
    isValidInvite
  }
}

export const mapDispatchToProps = {
  checkInvitation
}

export default connect(mapStateToProps, mapDispatchToProps)
