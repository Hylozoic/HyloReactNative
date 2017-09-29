import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const communityId = state.currentCommunity ||
    currentUser && get('id', currentUser.lastViewedCommunity())
  return {currentUser, communityId}
}

export default connect(mapStateToProps)
