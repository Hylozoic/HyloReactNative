import { getEmptyState } from '../index'
import { LOGOUT } from '../../components/Login/actions'
import { UNBLOCK_USER } from '../../components/BlockedUsers/BlockedUsers.store'
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

  if (action.type === UNBLOCK_USER && !action.error) {
    reset() // this is an async action with side effects! TODO move to logout action
    return {
      ...getEmptyState(),
      session: {
        loggedIn: true
      }
    }
  }

  return state
}
