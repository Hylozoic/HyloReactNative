import { getEmptyState } from '../index'
import { LOGOUT } from '../../components/Login/actions'
import { RESET_STORE } from '../constants'
import { reset } from './persistence'

export default function (state, action) {
  if (action.type === LOGOUT && !action.error) {
    reset() // this is an async action with side effects! TODO move to logout action
    return {
      ...getEmptyState(),
      session: {
        loggedIn: false
      }
    }
  }

  if (action.type === RESET_STORE && !action.error) {
    reset() // this is an async action with side effects!
    return {
      ...getEmptyState(),
      session: {
        loggedIn: true
      }
    }
  }

  return state
}
