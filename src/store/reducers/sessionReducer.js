import {
  FETCH_CURRENT_USER,
  CHECK_SESSION_AND_SET_SIGNED_IN
} from 'store/constants'
import {
  LOGIN,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE
} from 'navigation/Login/actions'
import { SIGNUP, UPDATE_USER_SETTINGS } from 'navigation/SignupFlow/SignupFlow.store'
import { omit, get } from 'lodash/fp'

export default function sessionReducer (state = {}, action) {
  const { type, error, payload, meta } = action

  if (error) {
    switch (type) {
      case LOGIN:
      case LOGIN_WITH_FACEBOOK:
      case LOGIN_WITH_GOOGLE:
        return {
          ...state,
          loginError: payload.message || payload.response.body
        }
    }
    return state
  }

  switch (type) {
    case LOGIN:
      return {
        ...omit('loginError', state),
        signedIn: true,
        defaultLoginEmail: meta.email
      }
    case LOGIN_WITH_FACEBOOK:
    case LOGIN_WITH_GOOGLE:
      return {
        ...omit('loginError', state),
        signedIn: true
      }
    case CHECK_SESSION_AND_SET_SIGNED_IN:
      return { ...state, signedIn: payload }
    case SIGNUP:
      return {
        ...state,
        signupInProgress: true
      }
    case FETCH_CURRENT_USER:
      return {
        ...state,
        signedIn: true,
        signupInProgress: get('data.me.settings.signupInProgress', payload)
      }
    case UPDATE_USER_SETTINGS:
      return {
        ...state,
        signupInProgress: get('data.updateMe.settings.signupInProgress', payload)
      }
  }

  return state
}
