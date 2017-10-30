import { AsyncStorage } from 'react-native'
import { composeWithDevTools } from 'remote-redux-devtools'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { compact } from 'lodash'

import afterInteractionsMiddleware from './middleware/afterInteractions'
import apiMiddleware from './middleware/api'
import graphQLMiddleware from './middleware/graphQL'
import optimisticMiddleware from './middleware/optimistic'
import orm from './models'
import pendingMiddleware from './middleware/pending'
import { PERSISTED_STATE_KEY } from './reducers/persistence'
import promiseMiddleware from 'redux-promise'
import rootReducer, { combinedReducers } from './reducers'

const middleware = compact([
  graphQLMiddleware,
  apiMiddleware,
  afterInteractionsMiddleware,
  optimisticMiddleware,
  pendingMiddleware,
  promiseMiddleware,
  __DEV__ && createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error
  })
])

export default function getStore () {
  return getInitialState().then(initialState => {
    const composedMiddleware = composeWithDevTools(applyMiddleware(...middleware))
    const store = createStore(rootReducer, initialState, composedMiddleware)

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
      module.hot.accept(() => {
        const nextRootReducer = require('./reducers').default
        store.replaceReducer(nextRootReducer)
      })
    }

    return store
  })
}

export function getInitialState () {
  return Promise.resolve(getEmptyState())
  // for dev
  // eslint-disable-next-line no-unreachable
  return AsyncStorage.getItem(PERSISTED_STATE_KEY)
  .then(state => state ? JSON.parse(state) : getEmptyState())
}

export function getEmptyState () {
  return combinedReducers({orm: orm.getEmptyState()}, {type: ''})
}
