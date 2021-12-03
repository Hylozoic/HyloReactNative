import { omit, get } from 'lodash/fp'
import {
  LOGIN,
  LOGIN_WITH_APPLE,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE
} from 'screens/Login/actions'
import { SIGNUP } from 'screens/SignupFlow/SignupFlow.store'
import {
  CLEAR_EMAIL_TO_VERIFY,
  FETCH_CURRENT_USER,
  LOGIN_BY_TOKEN,
  SELECT_GROUP,
  STORE_RETURN_TO_PATH,
  UPDATE_USER_SETTINGS
} from 'store/constants'

export default function sessionReducer (state = {
  groupId: null,
  signedIn: false,
  signupInProgress: null,
  returnToPath: null
}, action) {
  const { type, error, payload, meta } = action

  if (error) {
    switch (type) {
      case LOGIN:
      case LOGIN_BY_TOKEN:
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
    case LOGIN_BY_TOKEN:
    case LOGIN_WITH_APPLE:
    case LOGIN_WITH_FACEBOOK:
    case LOGIN_WITH_GOOGLE:
      return {
        ...omit('loginError', state),
        signedIn: true,
        defaultLoginEmail: meta?.email
      }
    case SIGNUP:
      return {
        ...state,
        signupInProgress: true
      }
    case FETCH_CURRENT_USER:
      return {
        ...state,
        signedIn: !!get('data.me', payload),
        signupInProgress: get('data.me.settings.signupInProgress', payload)
      }
    case UPDATE_USER_SETTINGS:
      return {
        ...state,
        signupInProgress: get('data.updateMe.settings.signupInProgress', payload)
      }
    case CLEAR_EMAIL_TO_VERIFY:
      return omit('emailToVerify', state)
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
