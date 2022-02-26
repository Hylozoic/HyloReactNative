import { connect } from 'react-redux'
import getGroup from 'store/selectors/getGroup'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
// import getMe from 'store/selectors/getMe'
import {
  regenerateAccessCode,
  CREATE_INVITATIONS,
  createInvitations,
  getPendingInvites,
  expireInvitation,
  resendInvitation,
  reinviteAll
} from './InvitePeople.store'
import updateGroupSettings from 'store/actions/updateGroupSettings'
import fetchGroupSettings from 'store/actions/fetchGroupSettings'
import { FETCH_GROUP_SETTINGS } from 'store/constants'

export function mapStateToProps (state, props) {
  const groupId = getCurrentGroupId(state, props)
  const group = getGroup(state, { id: groupId })
  const pending = state.pending[FETCH_GROUP_SETTINGS]
  const pendingCreate = state.pending[CREATE_INVITATIONS]

  const inviteLink = 'https://www.hylo.com' + group.invitePath
  const invites = getPendingInvites(state, { groupId: group.id })

  return {
    group,
    inviteLink,
    pending,
    pendingCreate,
    invites
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchGroupSettingsMaker: groupId => () => dispatch(fetchGroupSettings(groupId)),
    regenerateAccessCodeMaker: groupId => () => dispatch(regenerateAccessCode(groupId)),
    createInvitationsMaker: groupId => (emails, message) => dispatch(createInvitations(groupId, emails, message)),
    expireInvitation: (invitationToken) => dispatch(expireInvitation(invitationToken)),
    resendInvitation: (invitationToken) => dispatch(resendInvitation(invitationToken)),
    reinviteAllMaker: groupId => () => dispatch(reinviteAll(groupId)),
    setAllowGroupInvites: (groupId, allowGroupInvites) =>
      dispatch(updateGroupSettings(groupId, { settings: { allowGroupInvites } }))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const groupId = stateProps.group && stateProps.group.id
  const {
    fetchGroupSettingsMaker,
    reinviteAllMaker,
    regenerateAccessCodeMaker,
    createInvitationsMaker
  } = dispatchProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchGroupSettings: groupId ? fetchGroupSettingsMaker(groupId) : () => {},
    regenerateAccessCode: regenerateAccessCodeMaker(groupId),
    createInvitations: createInvitationsMaker(groupId),
    reinviteAll: reinviteAllMaker(groupId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
