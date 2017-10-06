import { logout } from '../Login/actions'
import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import { safeStringify } from 'util/index'

function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props),
    socketStatus: safeStringify(state.SocketListener, '  ')
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    logout: () => dispatch(logout()),
    close: () => props.navigation.goBack()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
