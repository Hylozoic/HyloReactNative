import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  // unseenThreadCount is only used in the component to trigger componentDidUpdate
  const { unseenThreadCount } = currentUser
  const communityId = state.currentCommunity ||
    (currentUser && get('id', currentUser.lastViewedCommunity()))
  return {currentUser, communityId, unseenThreadCount}
}

export default connect(mapStateToProps)
