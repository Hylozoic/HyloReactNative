import { getSessionCookie } from '../../util/session'

export const CHECK_SESSION = 'CHECK_SESSION'

export function checkSession () {
  return {
    type: CHECK_SESSION,
    // there's a harmless but confusing bug due to this promise payload that
    // returns an api payload: CHECK_SESSION_PENDING will get fired twice
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
