import { getSessionCookie } from '../../util/session'
export const CHECK_SESSION = 'CHECK_SESSION'
export const CHECK_VERSION = 'CHECK_VERSION'

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

export function checkVersion (platform, version) {
  const queryParams = `${platform}-version=${version}`
  return {
    type: CHECK_VERSION,
    payload: {
      api: {method: 'get', path: `/noo/mobile/auto-update-info?${queryParams}`}
    }
  }
}
