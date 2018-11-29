import { connect } from 'react-redux'

import getMe from '../../../store/selectors/getMe'
import getCurrentCommunityId from '../../../store/selectors/getCurrentCommunityId'
import getCurrentNetworkId from '../../../store/selectors/getCurrentNetworkId'
import { mapWhenFocused } from 'util/connector'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props),
    communityId: getCurrentCommunityId(state, props),
    networkId: getCurrentNetworkId(state, props)
  }
}

export default connect(mapWhenFocused(mapStateToProps))