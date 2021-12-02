import { applyMiddleware, createStore, compose } from 'redux'
import rootReducer from './reducers'
import getEmptyState from './getEmptyState'
import middleware from './middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['signup']
}

export function getStore () {
  const emptyState = getEmptyState()
  const persistedRootReducer = persistReducer(persistConfig, rootReducer)
  const store = (undefined === global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? createStore(persistedRootReducer, emptyState, compose(applyMiddleware(...middleware)))
    : createStore(persistedRootReducer, emptyState,
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

const store = getStore()

export default store

export const persistor = persistStore(store)
