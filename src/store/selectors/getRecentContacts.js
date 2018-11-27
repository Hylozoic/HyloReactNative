import { isEmpty, includes } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { FETCH_RECENT_CONTACTS } from 'store/constants'

export const getRecentContactsResults = makeGetQueryResults(FETCH_RECENT_CONTACTS)
export const getRecentContacts = ormCreateSelector(
  orm,
  state => state.orm,
  getRecentContactsResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.PersonConnection.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toModelArray()
      .map(pc => pc.person)
  }
)

export default getRecentContacts
