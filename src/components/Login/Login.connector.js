import { connect } from 'react-redux'
import { LOGIN, login, loginWithFacebook, loginWithGoogle } from './actions'

export function mapStateToProps (state) {
  const error = state.session.loginError
  const emailError = error && error.includes('email')
  const passwordError = error && error.includes('password')
  const pending = state.pending[LOGIN]
  return {
    error,
    emailError,
    passwordError,
    pending,
    defaultEmail: state.session.defaultLoginEmail
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    loginWithFacebook: (token) => dispatch(loginWithFacebook(token)),
    loginWithGoogle: (token) => dispatch(loginWithGoogle(token)),
    login: (email, password) => dispatch(login(email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
