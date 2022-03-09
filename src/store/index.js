import { applyMiddleware, createStore as reduxCreateStore, compose } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'
import rootReducer from 'store/reducers'
import middleware from 'store/middleware'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['SignupFlow']
}

export const initialState = {}

export function createInitialState (state = initialState) {
  return rootReducer(state, { type: '' })
}

export function createStore (state = initialState) {
  const emptyState = createInitialState(state)
  const persistedRootReducer = persistReducer(persistConfig, rootReducer)
  const store = (undefined === global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? reduxCreateStore(persistedRootReducer, emptyState, compose(applyMiddleware(...middleware)))
    : reduxCreateStore(persistedRootReducer, emptyState,
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

export const persistor = persistStore(store)
export default store
