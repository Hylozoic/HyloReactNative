import {
  API_HOST, IOS_EMULATOR_API_HOST, ANDROID_EMULATOR_API_HOST
} from 'react-native-dotenv'
import { setSessionCookie } from './session'
import { isIOS } from 'util/platform'

const HOST = __DEV__
  ? isIOS ? IOS_EMULATOR_API_HOST : ANDROID_EMULATOR_API_HOST
  : API_HOST

export default function fetchJSON (path, params, options = {}) {
  const { host, method, cookie } = options
  const url = (host || HOST) + path
  return fetch(url, {
    method: method || 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cookie': cookie
    },
    body: JSON.stringify(params)
  })
  .then(resp => {
    let { status, statusText, url } = resp
    if (status === 200) {
      return setSessionCookie(resp).then(() => resp.json())
    }

    return resp.text().then(body => {
      let error = new Error(body)
      error.response = {status, statusText, url, body}
      throw error
    })
  })
}
