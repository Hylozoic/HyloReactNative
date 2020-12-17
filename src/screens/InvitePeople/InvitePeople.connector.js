import { connect } from 'react-redux'
import getCommunity from 'store/selectors/getCommunity'
import getCurrentCommunityId from 'store/selectors/getCurrentCommunityId'
// import getMe from 'store/selectors/getMe'
import {
  regenerateAccessCode, fetchCommunitySettings, FETCH_COMMUNITY_SETTINGS,
  CREATE_INVITATIONS,
  createInvitations,
  getPendingInvites,
  expireInvitation,
  resendInvitation,
  reinviteAll,
  allowCommunityInvites
} from './InvitePeople.store'

export function mapStateToProps (state, props) {
  const communityId = getCurrentCommunityId(state, props)
  const community = getCommunity(state, { id: communityId })
  const pending = state.pending[FETCH_COMMUNITY_SETTINGS]
  const pendingCreate = state.pending[CREATE_INVITATIONS]

  const inviteLink = 'https://www.hylo.com' + community.invitePath
  const invites = getPendingInvites(state, { communityId: community.id })

  return {
    community,
    inviteLink,
    pending,
    pendingCreate,
    invites
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchCommunitySettingsMaker: communityId => () => dispatch(fetchCommunitySettings(communityId)),
    regenerateAccessCodeMaker: communityId => () => dispatch(regenerateAccessCode(communityId)),
    createInvitationsMaker: communityId => (emails, message) => dispatch(createInvitations(communityId, emails, message)),
    expireInvitation: (invitationToken) => dispatch(expireInvitation(invitationToken)),
    resendInvitation: (invitationToken) => dispatch(resendInvitation(invitationToken)),
    reinviteAllMaker: communityId => () => dispatch(reinviteAll(communityId)),
    allowCommunityInvites: (communityId, setAllow) => dispatch(allowCommunityInvites(communityId, setAllow))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const communityId = stateProps.community && stateProps.community.id
  const {
    fetchCommunitySettingsMaker,
    reinviteAllMaker,
    regenerateAccessCodeMaker,
    createInvitationsMaker
  } = dispatchProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchCommunitySettings: communityId ? fetchCommunitySettingsMaker(communityId) : () => {},
    regenerateAccessCode: regenerateAccessCodeMaker(communityId),
    createInvitations: createInvitationsMaker(communityId),
    reinviteAll: reinviteAllMaker(communityId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
