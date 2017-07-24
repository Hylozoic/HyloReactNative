import { getSessionCookie } from '../../util/session'
import fetchJSON from '../../util/fetchJSON'

let localCookie

export default function apiMiddleware (store) {
  return next => action => {
    const { payload } = action
    if (!payload || !payload.api) return next(action)

    const { path, params, method, transform } = payload.api

    let promise = (() => {
      // FIXME: this needs to be cleared when the session becomes invalid
      if (localCookie) return Promise.resolve(localCookie)
      return getSessionCookie().then(cookie => {
        localCookie = cookie
        return cookie
      })
    })()
    .then(cookie => fetchJSON(path, params, {method, cookie}))
    .then(json => transform ? transform(json) : json)

    return next({...action, payload: promise})
  }
}
