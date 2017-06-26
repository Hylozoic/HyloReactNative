import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { login, loginWithFacebook, loginWithGoogle } from './actions'

function mapStateToProps (state) {
  return {
    error: state.session.loginError,
    defaultEmail: state.session.defaultLoginEmail
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      login,
      loginWithFacebook,
      loginWithGoogle
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
