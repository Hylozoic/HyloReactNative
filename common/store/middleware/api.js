import { getSessionCookie } from '../../util/session'
import fetchJSON from '../../util/fetchJSON'

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
