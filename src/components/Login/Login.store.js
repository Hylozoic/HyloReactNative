import {
  LOGIN,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE
} from './actions'
import {
  FETCH_CURRENT_USER
} from 'store/actions/fetchCurrentUser'

export function getPending (state) {
  return state.pending[LOGIN] ||
    state.pending[LOGIN_WITH_FACEBOOK] ||
    state.pending[LOGIN_WITH_GOOGLE] ||
    state.pending[FETCH_CURRENT_USER]
}
