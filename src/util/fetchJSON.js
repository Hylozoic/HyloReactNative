import { setSessionCookie } from './session'
import apiHost from './apiHost'

export default function fetchJSON (path, params, options = {}) {
  const { host, method } = options
  const url = (host || apiHost) + path
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
