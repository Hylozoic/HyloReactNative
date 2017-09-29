import { makeGetQueryResults } from '../../store/reducers/queryResults'
import { FETCH_THREADS } from '../../store/actions/fetchThreads'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

const getThreadResults = makeGetQueryResults(FETCH_THREADS)

export const getThreads = ormCreateSelector(
  orm,
  get('orm'),
  ({ MessageThread }) =>
    MessageThread.all().orderBy(thread => -new Date(thread.updatedAt))
    .toModelArray().map(thread => ({
      ...thread.ref,
      participants: thread.participants.toRefArray(),
      latestMessage: thread.messages.orderBy(m => -new Date(m.createdAt)).first()
    }))
)

export const getThreadsHasMore = createSelector(getThreadResults, get('hasMore'))
