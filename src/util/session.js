import AsyncStorage from '@react-native-async-storage/async-storage'
import { isNull, isUndefined, omitBy, reduce } from 'lodash'

const SESSION_COOKIE_KEY = 'hylo-dev-local' // 'hylo.sid.1'

export function setSessionCookie (resp) {
  const header = resp.headers.get('set-cookie')
  if (!header) return Promise.resolve()

  const newCookies = parseCookies(header)

  return getSessionCookie().then(str => {
    const oldCookies = parseCookies(str)
    const merged = omitBy({ ...oldCookies, ...newCookies }, invalidPair)
    return AsyncStorage.setItem(SESSION_COOKIE_KEY, serializeCookie(merged))
  })
}

export function getSessionCookie () {
  return AsyncStorage.getItem(SESSION_COOKIE_KEY)
}

export function clearSessionCookie () {
  return AsyncStorage.removeItem(SESSION_COOKIE_KEY)
}

// this is a bag of hacks that probably only works with our current backend.
// we have to handle three cases: one in which we get a 'hylo.sid.1' cookie from
// Sails, one in which we get a 'heroku-session-affinity' cookie from heroku,
// and one in which we get both at once, comma-delimited.
//
// but parsing the third case is not simply a matter of splitting by a comma,
// because a comma can also occur in the value for Expires in a cookie.
//
// see the tests for an example taken from the production server.
export function parseCookies (cookieStr) {
  if (!cookieStr) return {}
  return cookieStr.split(';').reduce((m, n) => {
    const splits = n.trim().split('=')
    const key = splits[0]
    const value = splits[1]

    // if value contains ', ' and the key is not Expires, then this pair is
    // actually two pairs, which should be parsed and handled separately
    if (value && value.includes(', ') && key !== 'Expires') {
      const [value1, key2] = value.split(', ')
      const value2 = splits[2]
      m[decodeURIComponent(key)] = decodeURIComponent(value1)
      m[decodeURIComponent(key2)] = decodeURIComponent(value2)
    } else {
      m[decodeURIComponent(key)] = decodeURIComponent(value)
    }
    return m
  }, {})
}

export function serializeCookie (cookieObj) {
  return reduce(cookieObj, (m, v, k) => {
    if (isUndefined(k) || isUndefined(v)) return m

    const segment = encodeURIComponent(k) + '=' + encodeURIComponent(v)
    return m ? m + '; ' + segment : segment
  }, null)
}

function invalidPair (v, k) {
  return isNull(k) || isUndefined(k) || v === 'undefined' ||
    ['HttpOnly', 'Expires', 'Max-Age', 'Domain', 'Path', 'Version'].includes(k)
}
