import { connect } from 'react-redux'
import { loginWithApple, loginWithFacebook, loginWithGoogle } from 'navigation/Login/actions'
import { getPending } from 'navigation/Login/Login.store'

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
  loginWithApple, loginWithFacebook, loginWithGoogle
}

export default connect(mapStateToProps, mapDispatchToProps)
