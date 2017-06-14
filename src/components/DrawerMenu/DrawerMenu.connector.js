import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'

function mapStateToProps (state) {
  const currentUser = getMe(state)
  return {
    currentUser,
    memberships: currentUser ? currentUser.memberships.toModelArray() : []
  }
}

export default connect(mapStateToProps, null, null, {withRef: true})
