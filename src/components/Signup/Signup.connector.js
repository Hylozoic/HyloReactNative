import { connect } from 'react-redux'
import { loginWithFacebook, loginWithGoogle } from '../Login/actions'
import { getPending } from '../Login/Login.store'

export function mapStateToProps (state, props) {
  const goToSignupFlow = () => props.navigation.navigate('SignupFlow1')
  const goToLogin = () => props.navigation.navigate('Login')
  return {
    goToSignupFlow,
    goToLogin,
    error: state.session.loginError,
    pending: getPending(state)
  }
}

export const mapDispatchToProps = {
  loginWithFacebook, loginWithGoogle
}

export default connect(mapStateToProps, mapDispatchToProps)
