import { createLogger } from 'redux-logger'
import { compact } from 'lodash'
import afterInteractionsMiddleware from './afterInteractions'
import apiMiddleware from './api'
import graphQLMiddleware from './graphqlMiddleware'
import optimisticMiddleware from './optimistic'
import pendingMiddleware from './pending'
import promiseMiddleware from 'redux-promise'
import userFetchedMiddleware from './userFetchedMiddleware'
import userBlockingMiddleware from './userBlockingMiddleware'
import mixpanelMiddleware from './mixpanelMiddleware'
import { isDev } from 'config'

const middleware = compact([
  graphQLMiddleware,
  apiMiddleware,
  afterInteractionsMiddleware,
  optimisticMiddleware,
  pendingMiddleware,
  promiseMiddleware,
  userFetchedMiddleware,
  userBlockingMiddleware,
  mixpanelMiddleware,
  isDev && createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error
  })
])

export default middleware
