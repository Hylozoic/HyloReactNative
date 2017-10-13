import { getSessionCookie } from '../../util/session'
export const CHECK_SESSION = 'CHECK_SESSION'

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
