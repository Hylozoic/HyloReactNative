import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const showBadge = !!currentUser.unseenThreadCount
  return {showBadge}
}

export default connect(mapStateToProps)
