import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const showBadge = get('newNotificationCount', currentUser)
  return {showBadge}
}

export default connect(mapStateToProps)
