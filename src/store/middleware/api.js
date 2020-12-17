import { InteractionManager } from 'react-native'
import fetchJSON from 'util/fetchJSON'

export default function apiMiddleware (store) {
  return next => action => {
    const { payload, meta } = action

    if (!payload || !payload.api) return next(action)

    const { path, params, method, transform, retry } = payload.api
    const fetcher = (resolve, reject) => {
      InteractionManager.runAfterInteractions(() =>
        fetchJSON(path, params, { method })
          .then(json => resolve(transform ? transform(json) : json))
          .catch(handleError(resolve, reject))
      )
    }
    const handleError = (resolve, reject) => error => {
      if (retry) {
        // TODO: Add exponential backoff
        setTimeout(() => fetcher(resolve, reject), 1000)
      } else {
        reject(error)
      }
    }
    let promise = new Promise(fetcher)

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({ ...action, payload: promise })
  }
}
