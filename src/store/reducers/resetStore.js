import { pick } from 'lodash/fp'
import getEmptyState from 'store/getEmptyState'
import { LOGOUT } from 'store/constants'
import { RESET_STORE } from '../constants'
import { reset } from './persistence'

export const KEYS_PRESERVED_ON_RESET = [
  'session',
  'SocketListener'
]

export function keepAfterLogout (state) {
  return {
    session: {
      returnToPath: state?.session?.returnToPath
    }
  }
}

export function keepAfterReset (state) {
  return pick(KEYS_PRESERVED_ON_RESET, state)
}

export default function (state, action) {
  if (action.type === LOGOUT && !action.error) {
    reset() // this is an async action with side effects! TODO move to logout action
    return {
      ...getEmptyState(),
      ...keepAfterLogout(state)
    }
  }

  if (action.type === RESET_STORE && !action.error) {
    reset() // this is an async action with side effects!
    return {
      ...getEmptyState(),
      ...keepAfterReset(state)
    }
  }

  return state
}
