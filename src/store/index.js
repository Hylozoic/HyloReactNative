import { applyMiddleware, createStore, compose } from 'redux'
import orm from './models'
import rootReducer, { combinedReducers } from './reducers'
import middleware from './middleware'

export default function getStore () {
  const emptyState = getEmptyState()
  const store = (undefined === window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? createStore(rootReducer, emptyState, compose(applyMiddleware(...middleware)))
    : createStore(rootReducer, emptyState,
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
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

// TODO: AsyncStorage is currently bugged with remote debugger:
// https://github.com/facebook/react-native/issues/12830
// If we reinstated this, we'd need to rewire the currently synchronous store
// load in index.js
// export async function getInitialState () {
// if (!isDev) return getEmptyState()

// try {
//   const state = await AsyncStorage.getItem(PERSISTED_STATE_KEY)
//   return state ? JSON.parse(state) : getEmptyState()
// } catch (e) {
//   console.log("Couldn't retrieve state from AsyncStorage!")
//   return getEmptyState()
// }
// }

export function getEmptyState () {
  return combinedReducers({orm: orm.getEmptyState()}, {type: ''})
}
