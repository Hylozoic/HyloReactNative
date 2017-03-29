import { Platform } from 'react-native'
import { API_HOST, IOS_EMULATOR_API_HOST, ANDROID_EMULATOR_API_HOST } from 'react-native-dotenv'
import { getSessionCookie, setSessionCookie } from '../../util/session'
import DeviceInfo from 'react-native-device-info'

const HOST = DeviceInfo.isEmulator()
  ? (Platform.OS === 'ios' ? IOS_EMULATOR_API_HOST : ANDROID_EMULATOR_API_HOST)
  : API_HOST

export default function apiMiddleware (store) {
  return next => action => {
    const { payload } = action
    if (!payload || !payload.api) return next(action)

    const { path, params, method, transform } = payload.api
    let promise = getSessionCookie()
    .then(cookie => fetchJSON(path, params, {method, cookie}))
    .then(json => transform ? transform(json) : json)

    return next({...action, payload: promise})
  }
}

function fetchJSON (path, params, options = {}) {
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
