import { getSessionCookie } from '../../util/session'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'

export const CHECK_SESSION = 'CHECK_SESSION'
export const SET_ENTRY_URL = 'SET_ENTRY_URL'
export const RESET_ENTRY_URL = 'RESET_ENTRY_URL'

export function checkSession () {
  return {
    type: CHECK_SESSION,
    payload: getSessionCookie().then(cookie => {
      if (!cookie) return false

      return {
        api: {
          path: '/noo/user/status',
          transform: json => !!json.signedIn
        }
      }
    })
  }
}

export function setEntryURL (url) {
  return {type: SET_ENTRY_URL, payload: url}
}

export function resetEntryURL (url) {
  return {type: RESET_ENTRY_URL}
}

export const getEntryURL = createSelector(
  get('session'),
  get('entryURL')
)
