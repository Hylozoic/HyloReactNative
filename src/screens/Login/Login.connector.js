import { connect } from 'react-redux'
import {
  login,
  loginWithApple,
  loginWithFacebook,
  loginWithGoogle,
  loginByToken
} from './actions'
import { getPending } from './Login.store'
import getRouteParam from 'store/selectors/getRouteParam'
// import { getNavigationAction } from 'routing/DeepLinkHandler/DeepLinkHandler.store'

export function mapStateToProps (state, props) {
  const formError = state.session.loginError
  const pending = getPending(state)
  const goToSignup = () => props.navigation.navigate('Signup')
  const goToResetPassword = () => props.navigation.navigate('ForgotPassword')
  return {
    pending,
    signupInProgress: getRouteParam('signupInProgress', props.route),
    bannerMessage: getRouteParam('bannerMessage', props.route),
    formError,
    defaultEmail: state.session.defaultLoginEmail,
    goToSignup,
    goToResetPassword,
    loginToken: decodeURIComponent(getRouteParam('loginToken', props.route)),
    loginTokenUserId: getRouteParam('userId', props.route),
    // TODO: May bring back DeepLink
    // deepLinkAction: getNavigationAction(state)
  }
}

export const mapDispatchToProps = {
  loginWithApple,
  loginWithFacebook,
  loginWithGoogle,
  login,
  loginByToken
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    loginWithApple,
    loginWithGoogle,
    loginWithFacebook,
    login,
    loginByToken
  } = dispatchProps
  const finishLogin = async (action) => {
    if (action.error) {
      const errorMessage = action?.payload?.response?.body
      return errorMessage ? { errorMessage } : null
    }
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
