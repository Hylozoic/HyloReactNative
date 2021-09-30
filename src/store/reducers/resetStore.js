import { pick } from 'lodash/fp'
import getEmptyState from 'store/getEmptyState'
import { LOGOUT } from 'store/constants'
import { RESET_STORE } from '../constants'
import { reset } from './persistence'

export const KEYS_PRESERVED_ON_RESET = [
  'session',
  'SocketListener'
]

export default function (state, action) {
  if (action.type === LOGOUT && !action.error) {
    reset() // this is an async action with side effects! TODO move to logout action
    return getEmptyState()
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
