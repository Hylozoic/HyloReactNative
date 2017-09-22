import { connect } from 'react-redux'
import { login, loginWithFacebook, loginWithGoogle } from './actions'

function mapStateToProps (state, props) {
  const goToSignup = () => props.navigation.navigate('Signup')
  return {
    error: state.session.loginError,
    defaultEmail: state.session.defaultLoginEmail,
    goToSignup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loginWithFacebook: (token) => dispatch(loginWithFacebook(token)),
    loginWithGoogle: (token) => dispatch(loginWithGoogle(token)),
    login: (email, password) => dispatch(login(email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
