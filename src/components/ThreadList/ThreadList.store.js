import { makeGetQueryResults } from '../../store/reducers/queryResults'
import { FETCH_THREADS } from '../../store/actions/fetchThreads'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from '../../store/models'

const getThreadResults = makeGetQueryResults(FETCH_THREADS)

export const getThreads = ormCreateSelector(
  orm,
  state => state.orm,
  getThreadResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.MessageThread.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray().map(thread => ({
      ...thread.ref,
      participants: thread.participants.toRefArray(),
      messages: thread.messages.toRefArray()
    }))
  }
)

export const getThreadsHasMore = createSelector(getThreadResults, get('hasMore'))
