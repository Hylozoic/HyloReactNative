import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import {
  login,
  loginWithFacebook,
  loginWithGoogle,
  loginByToken
} from './actions'
import { getPending } from './Login.store'
import { register as registerOneSignal } from 'util/onesignal'
import registerDevice from '../../store/actions/registerDevice'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import { redirectAfterLogin } from 'util/navigation'
import { getNavigationAction } from '../DeepLinkHandler/DeepLinkHandler.store'

export function mapStateToProps (state, props) {
  const error = state.session.loginError
  const pending = getPending(state)
  const goToSignup = () => props.navigation.navigate('Signup')
  const goToResetPassword = () => props.navigation.navigate('ForgotPassword')
  return {
    loggedIn: state.session.loggedIn,
    error,
    pending,
    defaultEmail: state.session.defaultLoginEmail,
    goToSignup,
    goToResetPassword,
    hasSignupLink: !!state.session.hasSignupLink,
    loginToken: decodeURIComponent(get('navigation.state.params.loginToken', props)),
    loginTokenUserId: get('navigation.state.params.userId', props),
    deepLinkAction: getNavigationAction(state)
  }
}

export const mapDispatchToProps = {
  registerDevice,
  loginWithFacebook,
  loginWithGoogle,
  login,
  loginByToken,
  fetchCurrentUser
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    registerDevice,
    loginWithGoogle,
    loginWithFacebook,
    login,
    loginByToken,
    fetchCurrentUser
  } = dispatchProps

  const finishLogin = action => {
    if (action.error) return
    registerOneSignal({registerDevice})

    return fetchCurrentUser().then(({ error, payload }) =>
      !error && redirectAfterLogin({
        navigation: ownProps.navigation,
        currentUser: payload.data.me,
        action: stateProps.deepLinkAction
      }))
  }

  return {
    ...ownProps,
    ...stateProps,
    loginWithFacebook: (token) =>
      loginWithFacebook(token).then(finishLogin),
    loginWithGoogle: (token) =>
      loginWithGoogle(token).then(finishLogin),
    loginByToken: () => {
      const { loginTokenUserId, loginToken } = stateProps
      console.log('!!! deepLinkAction:', stateProps.deepLinkAction)
      console.log('!!! loginByToken(loginTokenUserId, loginToken):', loginTokenUserId, loginToken)
      return loginToken && loginByToken(loginTokenUserId, loginToken)
      .then(finishLogin)
    },
    login: (email, password) =>
      login(email, password).then(finishLogin)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
