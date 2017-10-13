import { getEmptyState } from '../index'
import { LOGOUT } from '../../components/Login/actions'
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

  return state
}
