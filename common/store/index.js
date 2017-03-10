import { applyMiddleware, createStore } from 'redux'
import { compact, memoize } from 'lodash'
import rootReducer from '../reducer'
import promiseMiddleware from 'redux-promise'
import apiMiddleware from './middleware/api'
import createLogger from 'redux-logger'

const middleware = compact([
  apiMiddleware,
  promiseMiddleware,
  __DEV__ && createLogger({collapsed: true})
])

export default memoize(function getStore () {
  const initialState = {}
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
