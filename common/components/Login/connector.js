import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { login, loginWithFacebook } from './actions'

function mapStateToProps (state) {
  return {
    error: state.loginError,
    defaultEmail: state.defaultLoginEmail
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      login,
      loginWithFacebook
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
