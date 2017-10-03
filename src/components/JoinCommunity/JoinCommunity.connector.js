import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import {
  getNewMembership,
  useInvitation,
  resetInvitationCodes,
  getInvitationCodes
} from './JoinCommunity.store'

export function mapStateToProps (state, props) {
  const newMembership = getNewMembership(state)
  return {
    invitationCodes: getInvitationCodes(state),
    communitySlug: get('community.slug', newMembership)
  }
}

export const mapDispatchToProps = {
  useInvitation,
  resetInvitationCodes
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    useInvitation: () => stateProps.invitationCodes && useInvitation(stateProps.invitationCodes)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
