import { connect } from 'react-redux'
import {
  login,
  loginWithApple,
  loginWithFacebook,
  loginWithGoogle
} from './actions'
import logout from 'store/actions/logout'
import { getPending } from './Login.store'
import getRouteParam from 'store/selectors/getRouteParam'
import getSignupInProgress from 'store/selectors/getSignupInProgress'

export function mapStateToProps (state, props) {
  const formError = state.session.loginError
  const pending = getPending(state)
  const goToSignup = () => props.navigation.navigate('Signup')
  const goToResetPassword = () => props.navigation.navigate('ForgotPassword')
  return {
    pending,
    signupInProgress: getSignupInProgress(state),
    bannerMessage: getRouteParam('bannerMessage', props.route),
    formError,
    defaultEmail: state.session?.defaultLoginEmail,
    goToSignup,
    goToResetPassword,
    returnToURLFromLink: decodeURIComponent(getRouteParam('n', props.route)),
    loginToken: decodeURIComponent(getRouteParam('t', props.route) || getRouteParam('loginToken', props.route)),
    loginTokenUserId: getRouteParam('u', props.route) || getRouteParam('userId', props.route)
  }
}

export const mapDispatchToProps = {
  logout,
  login,
  loginWithApple,
  loginWithFacebook,
  loginWithGoogle
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    logout,
    login,
    loginWithApple,
    loginWithGoogle,
    loginWithFacebook
  } = dispatchProps
  const finishLogin = (action) => {
    if (action.error) {
      const errorMessage = action?.payload?.response?.body
      return errorMessage ? { errorMessage } : null
    }
  }

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    loginWithApple: async token => {
      await logout()
      const action = await loginWithApple(token)
      return finishLogin(action)
    },
    loginWithFacebook: async token => {
      await logout()
      const action = await loginWithFacebook(token)
      return finishLogin(action)
    },
    loginWithGoogle: async token => {
      await logout()
      const action = await loginWithGoogle(token)
      return finishLogin(action)
    },
    login: async (email, password) => {
      await logout()
      const action = await login(email, password)
      return finishLogin(action)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
