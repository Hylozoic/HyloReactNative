import { applyMiddleware, createStore } from 'redux'
import { compact } from 'lodash'
import rootReducer from '../reducer'
import promiseMiddleware from 'redux-promise'
import apiMiddleware from './middleware/api'
import graphQLMiddleware from './middleware/graphQL'
import createLogger from 'redux-logger'
import { AsyncStorage } from 'react-native'
import { PERSISTED_STATE_KEY } from '../reducer/persistence'
import orm from './models'

const middleware = compact([
  graphQLMiddleware,
  apiMiddleware,
  promiseMiddleware,
  __DEV__ && createLogger({collapsed: true})
])

export default function getStore () {
  return getInitialState().then(initialState => {
    const store = createStore(rootReducer, initialState,
      applyMiddleware(...middleware))

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
      module.hot.accept(() => {
        const nextRootReducer = require('../reducer')
        store.replaceReducer(nextRootReducer)
      })
    }

    return store
  })
}

function getInitialState () {
  return AsyncStorage.getItem(PERSISTED_STATE_KEY)
  .then(state => state ? JSON.parse(state) : getEmptyState())
}

function getEmptyState () {
  return {
    orm: orm.getEmptyState()
  }
}
