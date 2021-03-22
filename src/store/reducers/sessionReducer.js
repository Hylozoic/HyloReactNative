import { omit, get } from 'lodash/fp'
import {
  LOGIN,
  LOGIN_WITH_APPLE,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE
} from 'screens/Login/actions'
import {
  SIGNUP,
  UPDATE_USER_SETTINGS
} from 'screens/SignupFlow/SignupFlow.store'
import {
  FETCH_CURRENT_USER,
  CHECK_SESSION_AND_SET_SIGNED_IN,
  SELECT_GROUP,
  STORE_RETURN_TO_PATH
} from 'store/constants'

export default function sessionReducer (state = {
  groupId: null,
  signupInProgress: null,
  returnToPath: null
}, action) {
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
    case LOGIN_WITH_APPLE:
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
    case SELECT_GROUP:
      return {
        ...state,
        groupId: payload
      }
    case STORE_RETURN_TO_PATH:
      return {
        ...state,
        returnToPath: payload
      }
  }

  return state
}
