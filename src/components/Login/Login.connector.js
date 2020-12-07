import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import {
  login,
  loginWithApple,
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
  const formError = state.session.loginError
  const pending = getPending(state)
  const goToSignup = () => props.navigation.navigate('Signup')
  const goToResetPassword = () => props.navigation.navigate('ForgotPassword')
  return {
    loggedIn: state.session.loggedIn,
    formError,
    bannerMessage: get('route.params.bannerMessage', props),
    pending,
    defaultEmail: state.session.defaultLoginEmail,
    goToSignup,
    goToResetPassword,
    loginToken: decodeURIComponent(get('route.params.loginToken', props)),
    loginTokenUserId: get('route.params.userId', props),
    deepLinkAction: getNavigationAction(state)
  }
}

export const mapDispatchToProps = {
  registerDevice,
  loginWithApple,
  loginWithFacebook,
  loginWithGoogle,
  login,
  loginByToken,
  fetchCurrentUser
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    registerDevice,
    loginWithApple,
    loginWithGoogle,
    loginWithFacebook,
    login,
    loginByToken,
    fetchCurrentUser
  } = dispatchProps
  const finishLogin = async (action) => {
    if (action.error) {
      const errorMessage = get('payload.response.body', action)
      return errorMessage ? { errorMessage } : null
    }
    registerOneSignal({registerDevice})
    const { error, payload } = await fetchCurrentUser()
    return !error && redirectAfterLogin({
      navigation: ownProps.navigation,
      currentUser: payload.data.me,
      action: stateProps.deepLinkAction
    })
  }

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    loginWithApple: (token) =>
      loginWithApple(token).then(finishLogin),
    loginWithFacebook: (token) =>
      loginWithFacebook(token).then(finishLogin),
    loginWithGoogle: (token) =>
      loginWithGoogle(token).then(finishLogin),
    loginByToken: () => {
      const { loginTokenUserId, loginToken } = stateProps
      return loginTokenUserId && loginByToken(loginTokenUserId, loginToken)
      .then(finishLogin)
    },
    login: (email, password) =>
      login(email, password).then(finishLogin)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
