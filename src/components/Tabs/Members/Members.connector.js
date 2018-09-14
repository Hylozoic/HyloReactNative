import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import { mapWhenFocused } from 'util/connector'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import getCurrentNetwork from '../../../store/selectors/getCurrentNetwork'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const community = getCurrentCommunity(state, props)
  const network = getCurrentNetwork(state, props)

  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    currentUser,
    community,
    network,
    canModerate
  }
}

export default connect(
  mapWhenFocused(mapStateToProps)
)
