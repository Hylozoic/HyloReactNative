import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import {
  getNewMembership, useInvitation
} from './JoinCommunity.store'

export function mapStateToProps (state, props) {
  const newMembership = getNewMembership(state)
  return {
    // invitationToken: getQueryParam('token', state, props),
    // accessCode: getParam('accessCode', state, props),
    communitySlug: get('community.slug', newMembership)
  }
}

export const mapDispatchToProps = {
  useInvitation
}

export default connect(mapStateToProps, mapDispatchToProps)
