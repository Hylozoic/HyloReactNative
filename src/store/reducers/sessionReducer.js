import { LOGIN, LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE } from '../../components/Login/actions'
import { SIGNUP } from '../../components/SignupFlow/SignupFlow.store'
import { CHECK_SESSION, CHECK_VERSION } from '../../components/SessionCheck/actions'
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
    case CHECK_VERSION:
      return {
        ...state,
        checkVersion: payload
      }
    case SIGNUP:
      return {
        ...state,
        loggedIn: true
      }
  }

  return state
}
