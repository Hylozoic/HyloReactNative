import { applyMiddleware, createStore as reduxCreateStore, compose } from 'redux'
import createRootReducer from 'store/reducers'
import middleware from 'store/middleware'

export const initialState = {}

export function createInitialState (state = initialState) {
  return createRootReducer()(state, { type: '' })
}

export function createStore (state = initialState) {
  const emptyState = createInitialState(state)
  const store = (undefined === global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? reduxCreateStore(createRootReducer(), emptyState, compose(applyMiddleware(...middleware)))
    : reduxCreateStore(createRootReducer(), emptyState,
      global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
        applyMiddleware(...middleware)
      )
    )

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

const store = createStore()

export default store
