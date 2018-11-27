import { isEmpty, includes } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { FETCH_PEOPLE_AUTOCOMPLETE } from 'store/constants'

export const getPeopleAutocompleteResults = makeGetQueryResults(FETCH_PEOPLE_AUTOCOMPLETE)
export const getPeopleAutocomplete = ormCreateSelector(
  orm,
  state => state.orm,
  getPeopleAutocompleteResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Person.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toRefArray()
  }
)

export default getPeopleAutocomplete
