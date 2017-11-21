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

const mapDispatchToProps = {
  registerDevice,
  loginWithFacebook,
  loginWithGoogle,
  login
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    registerDevice,
    loginWithGoogle,
    loginWithFacebook,
    login
  } = dispatchProps

  const finishLogin = action => {
    if (action.error) return
    registerOneSignal({registerDevice})

    return ownProps.fetchCurrentUserAndRedirect()
  }

  return {
    ...ownProps,
    ...stateProps,
    loginWithFacebook: (token) =>
      loginWithFacebook(token).then(finishLogin),
    loginWithGoogle: (token) =>
      loginWithGoogle(token).then(finishLogin),
    login: (email, password) =>
      login(email, password).then(finishLogin)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
