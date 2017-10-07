import {
  LOGIN,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE
} from '../../components/Login/actions'
import { SIGNUP } from '../../components/SignupFlow/SignupFlow.store'
import {
  CHECK_SESSION,
  SET_ENTRY_URL,
  RESET_ENTRY_URL
} from '../../components/SessionCheck/SessionCheck.store'
import { omit } from 'lodash/fp'

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
        loggedIn: true,
        defaultLoginEmail: meta.email
      }
    case LOGIN_WITH_FACEBOOK:
    case LOGIN_WITH_GOOGLE:
      return {
        ...omit('loginError', state),
        loggedIn: true
      }
    case CHECK_SESSION:
      if (payload !== state.loggedIn) {
        return {...state, loggedIn: payload}
      }
      return state
    case SET_ENTRY_URL:
      return {...state, entryURL: payload}
    case RESET_ENTRY_URL:
      return {...state, entryURL: null}
    case SIGNUP:
      return {...state, loggedIn: true}
  }

  return state
}
