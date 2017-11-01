import {
  LOGIN,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_GOOGLE
} from './actions'

export function getPending (state) {
  return state.pending[LOGIN] ||
    state.pending[LOGIN_WITH_FACEBOOK] ||
    state.pending[LOGIN_WITH_GOOGLE]
}
