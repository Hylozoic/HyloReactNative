import { LOGIN, LOGOUT } from '../components/Login/actions'
import { CHECK_SESSION } from '../components/SessionCheck/actions'

export default function rootReducer (state, action) {
  const { type, error, payload, meta } = action

  if (error) {
    switch (type) {
      case LOGIN:
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
        ...state,
        loginError: null,
        loggedIn: true,
        defaultLoginEmail: meta.email // TODO persist this
      }
    case CHECK_SESSION:
      return {
        ...state,
        loggedIn: payload
      }
    case LOGOUT:
      return {
        ...state,
        loggedIn: false
      }
  }
  return {}
}
