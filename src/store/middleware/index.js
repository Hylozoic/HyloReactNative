import { createLogger } from 'redux-logger'
import { compact } from 'lodash'
import afterInteractionsMiddleware from './afterInteractions'
import apiMiddleware from './api'
import graphQLMiddleware from './graphQL'
import optimisticMiddleware from './optimistic'
import pendingMiddleware from './pending'
import promiseMiddleware from 'redux-promise'

const isDev = __DEV__ && process.env.NODE_ENV !== 'test'

const middleware = compact([
  graphQLMiddleware,
  apiMiddleware,
  afterInteractionsMiddleware,
  optimisticMiddleware,
  pendingMiddleware,
  promiseMiddleware,
  isDev && createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error
  })
])

export default middleware
