import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import { logout } from '../Login/actions'

function mapStateToProps (state) {
  const currentUser = getMe(state)
  return {
    currentUser,
    memberships: currentUser ? currentUser.memberships.toModelArray() : []
  }
}

export default connect(mapStateToProps, {logout}, null, {withRef: true})
