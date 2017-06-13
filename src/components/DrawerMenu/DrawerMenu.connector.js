import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout } from '../Login/actions'
import getMe from '../../store/selectors/getMe'

function mapStateToProps (state) {
  const currentUser = getMe(state)
  return {
    currentUser,
    memberships: currentUser ? currentUser.memberships.toModelArray() : []
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      logout
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
