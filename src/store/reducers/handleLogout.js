import { getEmptyState } from '../index'
import { LOGOUT } from '../../components/Login/actions'

export default function (state, action) {
  if (action.type === LOGOUT) {
    return {
      ...getEmptyState(),
      session: {
        loggedIn: false
      }
    }
  }

  return state
}
