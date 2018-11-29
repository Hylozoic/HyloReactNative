import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

// FIXME this could return topics that are not in the current community
export const getTopics = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { autocomplete }) => autocomplete,
  (session, autocomplete) => {
    const term = autocomplete && autocomplete.toLowerCase()
    return session.Topic.all()
      .filter(({ name }) => name && name.toLowerCase().match(term))
      .orderBy('name')
      .toRefArray()
  }
)

export default getTopics
