import {
  makeGetQueryResults,
  makeQueryResultsModelSelector
} from 'store/reducers/queryResults'
import { FETCH_RECENT_CONTACTS } from 'store/constants'

export default function scopedGetRecentContacts (_, { scope }) {
  if (!scope) throw new Error('`scope` prop is required for a querySearchTerm selection')

  const queryResultsScope = `${scope}/${FETCH_RECENT_CONTACTS}`
  const getRecentContactsResults = makeGetQueryResults(queryResultsScope)

  return makeQueryResultsModelSelector(
    getRecentContactsResults,
    'PersonConnection',
    personConnection => personConnection.person.ref
  )
}
