import { connect } from 'react-redux'
import {
  login,
  loginWithFacebook,
  loginWithGoogle
} from './actions'
import { getPending } from './Login.store'
import { register as registerOneSignal } from 'util/onesignal'
import registerDevice from '../../store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import { redirectAfterLogin } from 'util/navigation'
import { getDeepLink } from '../DeepLinkHandler/DeepLinkHandler.store'

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
    hasSignupLink: !!state.session.hasSignupLink,
    deepLink: getDeepLink(state)
  }
}

export const mapDispatchToProps = {
  registerDevice,
  loginWithFacebook,
  loginWithGoogle,
  login,
  fetchCurrentUser
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    registerDevice,
    loginWithGoogle,
    loginWithFacebook,
    login,
    fetchCurrentUser
  } = dispatchProps

  const finishLogin = action => {
    if (action.error) return
    registerOneSignal({registerDevice})

    return fetchCurrentUser().then(({ error, payload }) =>
      !error && redirectAfterLogin({
        navigation: ownProps.navigation,
        currentUser: payload.data.me,
        deepLink: stateProps.deepLink
      }))
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
