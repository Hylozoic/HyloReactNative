import { pick } from 'lodash/fp'
import { LOGOUT, RESET_STORE } from 'store/constants'
import orm from 'store/models'
import { combinedReducers } from '.'

export const KEYS_PRESERVED_ON_RESET = [
  'session',
  'SocketListener'
]

export function getEmptyState () {
  return combinedReducers({ orm: orm.getEmptyState() }, { type: '' })
}

export default function (state, action) {
  if (action.type === LOGOUT && !action.error) {
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
    return {
      ...getEmptyState(),
      ...pick(KEYS_PRESERVED_ON_RESET, state)
    }
  }

  return state
}
