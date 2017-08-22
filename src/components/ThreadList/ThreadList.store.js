import { makeGetQueryResults, makeQueryResultsModelSelector } from '../../store/reducers/queryResults'
import { FETCH_THREADS } from '../../store/actions/fetchThreads'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from '../../store/models'

const getThreadResults = makeGetQueryResults(FETCH_THREADS)

export const getThreads = makeQueryResultsModelSelector(
  getThreadResults,
  'MessageThread',
  thread => ({
    ...thread.ref,
    participants: thread.participants.toRefArray(),
    messages: thread.messages.orderBy(m => -new Date(m.createdAt)).toRefArray()
  })
)

export const getThreadsHasMore = createSelector(getThreadResults, get('hasMore'))
