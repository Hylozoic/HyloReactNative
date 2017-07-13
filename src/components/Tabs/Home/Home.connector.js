import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'

function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const communityId = state.currentCommunity ||
    currentUser && currentUser.lastViewedCommunity().id
  return {currentUser, communityId}
}

export default connect(mapStateToProps)
