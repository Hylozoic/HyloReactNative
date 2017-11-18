import { connect } from 'react-redux'
import {
  login,
  loginWithFacebook,
  loginWithGoogle
} from './actions'
import { getPending } from './Login.store'
import { register as registerOneSignal } from 'util/onesignal'
import registerDevice from '../../store/actions/registerDevice'
import { resetToRoute } from 'util/navigation'

export function mapStateToProps (state, props) {
  const error = state.session.loginError
  const pending = getPending(state)
  const goToSignup = () => props.navigation.navigate('Signup')
  return {
    loggedIn: state.session.loggedIn,
    error,
    pending,
    defaultEmail: state.session.defaultLoginEmail,
    goToSignup,
    hasSignupLink: !!state.session.hasSignupLink
  }
}

export function mapDispatchToProps (dispatch, props) {
  const finishLogin = action => {
    if (action.error) return
    registerOneSignal({registerDevice: id => dispatch(registerDevice(id))})
  }

  return {
    loginWithFacebook: (token) =>
      dispatch(loginWithFacebook(token)).then(finishLogin),
    loginWithGoogle: (token) =>
      dispatch(loginWithGoogle(token)).then(finishLogin),
    login: (email, password) =>
      dispatch(login(email, password)).then(finishLogin),
    leaveLoginScreen: () =>
      resetToRoute(props.navigation, 'Main')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
