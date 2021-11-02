import { pick } from 'lodash/fp'
import getEmptyState from 'store/getEmptyState'
import { LOGOUT, RESET_STORE } from 'store/constants'
import { reset } from './persistence'

export const KEYS_PRESERVED_ON_RESET = [
  'session',
  'SocketListener'
]

export default function (state, action) {
  if (action.type === LOGOUT && !action.error) {
    reset() // this is an async action with side effects!
    const emptyState = getEmptyState()
    return {
      ...emptyState,
      session: {
        ...emptyState.session,
        returnToPath: state?.session?.returnToPath || null
      }
    }
  }

  if (action.type === RESET_STORE && !action.error) {
    reset() // this is an async action with side effects!
    return {
      ...getEmptyState(),
      ...pick(KEYS_PRESERVED_ON_RESET, state)
    }
  }

  return state
}
