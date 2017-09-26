import { setSessionCookie } from './session'
import { isIOS } from 'util/platform'

export const HOST =
  (__DEV__ && isIOS &&
    (process.env.IOS_API_HOST || process.env.IOS_EMULATOR_API_HOST)) ||
  (__DEV__ && !isIOS &&
    (process.env.ANDROID_API_HOST || process.env.ANDROID_EMULATOR_API_HOST)) ||
  process.env.API_HOST

console.log(`API host: ${HOST}`)

export default function fetchJSON (path, params, options = {}) {
  const { host, method } = options
  const url = (host || HOST) + path
  return fetch(url, {
    method: method || 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
    withCredentials: true
  })
  .then(resp => {
    let { status, statusText, url } = resp
    if (status === 200) {
      // FIXME: this doesn't need to happen every time
      return setSessionCookie(resp).then(() => resp.json())
    }
    return resp.text().then(body => {
      let error = new Error(body)
      error.response = {status, statusText, url, body}
      throw error
    })
  })
}
