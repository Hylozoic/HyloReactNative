import { applyMiddleware, createStore } from 'redux'
import { compact } from 'lodash'
import rootReducer from '../reducer'
import promiseMiddleware from 'redux-promise'
import apiMiddleware from './middleware/api'
import createLogger from 'redux-logger'

const middleware = compact([
  apiMiddleware,
  promiseMiddleware,
  __DEV__ && createLogger({collapsed: true})
])

function getInitialState () {
  // TODO retrieve values from local storage for initial state
  return new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
}

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
