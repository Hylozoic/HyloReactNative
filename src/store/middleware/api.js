import { InteractionManager } from 'react-native'

import fetchJSON from '../../util/fetchJSON'

export default function apiMiddleware (store) {
  return next => action => {
    const { payload } = action
    if (!payload || !payload.api) return next(action)

    const { path, params, method, transform } = payload.api

    InteractionManager.runAfterInteractions(() => {
      const promise = fetchJSON(path, params, {method})
        .then(json => transform ? transform(json) : json)

      return next({...action, payload: promise})
    })
  }
}
