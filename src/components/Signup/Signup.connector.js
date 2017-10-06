import { connect } from 'react-redux'
import { loginWithFacebook, loginWithGoogle } from '../Login/actions'

export function mapStateToProps (state, props) {
  const goToSignupFlow = () => props.navigation.navigate('SignupFlow1')
  const goToLogin = () => props.navigation.navigate('Login')
  return {
    goToSignupFlow,
    goToLogin,
    error: state.session.loginError
  }
}

export const mapDispatchToProps = {
  loginWithFacebook, loginWithGoogle
}

export default connect(mapStateToProps, mapDispatchToProps)
