import { LOGIN, LOGIN_WITH_FACEBOOK, LOGOUT } from '../components/Login/actions'
import { FETCH_CURRENT_USER } from '../store/actions/fetchCurrentUser'
import { CHECK_SESSION } from '../components/SessionCheck/actions'
import { persist } from './persistence'
import { omit } from 'lodash/fp'

function rootReducer (state = {}, action) {
  const { type, error, payload, meta } = action

  if (error) {
    switch (type) {
      case LOGIN:
      case LOGIN_WITH_FACEBOOK:
        return {
          ...state,
          loginError: payload.message || payload.response.body
        }
    }
    return
  }

  switch (type) {
    case LOGIN:
      return {
        ...omit('loginError', state),
        loggedIn: true,
        defaultLoginEmail: meta.email
      }
    case LOGIN_WITH_FACEBOOK:
      return {
        ...omit('loginError', state),
        loggedIn: true
      }
    case CHECK_SESSION:
      if (payload !== state.loggedIn) {
        return {...state, loggedIn: payload}
      }
      return state
    case LOGOUT:
      return {
        ...state,
        loggedIn: false
      }
    case FETCH_CURRENT_USER:
      return {
        ...state,
        currentUser: payload.data.me
      }
  }

  return state
}

export default persist(rootReducer)
