import { AsyncStorage } from 'react-native'

const SESSION_COOKIE_KEY = 'session-cookie-v1'

export function setSessionCookie (resp) {
  let cookie = resp.headers.get('set-cookie')
  if (cookie) {
    cookie = cookie.split('; ')[0]
    return AsyncStorage.setItem(SESSION_COOKIE_KEY, cookie)
  }
  return Promise.resolve()
}

export function getSessionCookie () {
  return AsyncStorage.getItem(SESSION_COOKIE_KEY)
  .then(cookie => {
    console.log(`retrieved cookie: ${cookie}`)
    return cookie
  })
}
