import { createLogger } from 'redux-logger'
import { compact } from 'lodash'
import afterInteractionsMiddleware from './afterInteractions'
import apiMiddleware from './api'
import graphQLMiddleware from './graphQL'
import optimisticMiddleware from './optimistic'
import pendingMiddleware from './pending'
import promiseMiddleware from 'redux-promise'

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

export default middleware
