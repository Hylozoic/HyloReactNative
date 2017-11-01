import { connect } from 'react-redux'
import {
  login,
  loginWithFacebook,
  loginWithGoogle
} from './actions'
import { getPending } from './Login.store'
import { register as registerOneSignal } from 'util/onesignal'
import registerDevice from '../../store/actions/registerDevice'

export function mapStateToProps (state, props) {
  const error = state.session.loginError
  const emailError = error && error.includes('email')
  const passwordError = error && error.includes('password')
  const pending = getPending(state)
  const goToSignup = () => props.navigation.navigate('Signup')

  return {
    error,
    emailError,
    passwordError,
    pending,
    defaultEmail: state.session.defaultLoginEmail,
    goToSignup,
    hasSignupLink: !!state.session.hasSignupLink
  }
}

export function mapDispatchToProps (dispatch) {
  function setupPushNotifications (action) {
    if (action.error) return
    registerOneSignal({registerDevice: id => dispatch(registerDevice(id))})
  }

  return {
    loginWithFacebook: (token) =>
      dispatch(loginWithFacebook(token)).then(setupPushNotifications),
    loginWithGoogle: (token) =>
      dispatch(loginWithGoogle(token)).then(setupPushNotifications),
    login: (email, password) =>
      dispatch(login(email, password)).then(setupPushNotifications)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
