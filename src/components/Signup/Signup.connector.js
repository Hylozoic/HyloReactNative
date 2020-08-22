import { connect } from 'react-redux'
import { loginWithApple, loginWithFacebook, loginWithGoogle } from '../Login/actions'
import { getPending } from '../Login/Login.store'

export function mapStateToProps (state, props) {
  const goToSignupFlow = () => props.navigation.navigate({routeName: 'SignupFlow1', key: 'SignupFlow1'})
  const goToLogin = () => props.navigation.navigate({routeName: 'Login', key: 'Login'})
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
