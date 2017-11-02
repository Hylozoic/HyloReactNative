import { InteractionManager } from 'react-native'

import fetchJSON from '../../util/fetchJSON'

export default function apiMiddleware (store) {
  return next => action => {
    const { payload } = action
    if (!payload || !payload.api) return next(action)

    const { path, params, method, transform } = payload.api

    const newPayload = new Promise((resolve, reject) => {
      InteractionManager.runAfterInteractions(() => {
        fetchJSON(path, params, {method})
        .then(json => resolve(transform ? transform(json) : json))
        .catch(reject)
      })
    })

    return next({...action, payload: newPayload})
  }
}
