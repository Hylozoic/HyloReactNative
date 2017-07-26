import orm from 'store/models'
import { createSelector } from 'redux-orm'

export const getThreads = createSelector(
  orm,
  state => state.orm,
  session => {
    return session.MessageThread.all()
    .orderBy(t => new Date(t.updatedAt), 'desc')
    .toModelArray().map(thread => ({
      ...thread.ref,
      participants: thread.participants.toRefArray(),
      messages: thread.messages.toRefArray()
    }))
  }
)
