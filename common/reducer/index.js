import { LOGIN } from '../components/Login/actions'
import { CHECK_SESSION } from '../components/SessionCheck/actions'

export default function rootReducer (state, action) {
  const { type, error, payload } = action

  if (error) {
    switch (type) {
      case LOGIN:
        return {
          ...state,
          loginError: payload.response.body
        }
    }
    return
  }

  switch (type) {
    case LOGIN:
      return {
        ...state,
        loginError: null,
        loggedIn: true
      }
    case CHECK_SESSION:
      return {
        ...state,
        loggedIn: payload
      }
  }
  return {}
}
