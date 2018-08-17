import { createLogger } from 'redux-logger'
import { compact } from 'lodash'
import afterInteractionsMiddleware from './afterInteractions'
import apiMiddleware from './api'
import graphQLMiddleware from './graphQL'
import optimisticMiddleware from './optimistic'
import pendingMiddleware from './pending'
import promiseMiddleware from 'redux-promise'
import mixpanelMiddleware from './mixpanelMiddleware'
import { isDev } from 'util/testing'

const middleware = compact([
  graphQLMiddleware,
  apiMiddleware,
  afterInteractionsMiddleware,
  optimisticMiddleware,
  pendingMiddleware,
  promiseMiddleware,
  mixpanelMiddleware,
  isDev && createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error
  })
])

export default middleware
