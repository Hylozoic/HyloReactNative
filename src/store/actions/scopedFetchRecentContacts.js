import { get } from 'lodash/fp'
import { FETCH_RECENT_CONTACTS } from '../constants'

const fetchRecentContactsQuery =
`query RecentPersonConnections ($first: Int) {
  connections (first: $first) {
    items {
      id
      person {
        id
        name
        avatarUrl
        memberships (first: 1) {
          id
          group {
            id
            name
          }
        }
      }
      type
      updatedAt
    }
  }
}`

export default function scopedFetchRecentContacts (scope) {
  if (!scope) throw new Error('`scope` param is required for setting a querySearchTerm')

  const queryResultsScopedType = scope
    ? `${scope}/${FETCH_RECENT_CONTACTS}`
    : FETCH_RECENT_CONTACTS

  return function (
    first = 6,
    query = fetchRecentContactsQuery
  ) {
    return {
      type: queryResultsScopedType,
      graphql: {
        query,
        variables: { first }
      },
      meta: {
        extractModel: 'PersonConnection',
        extractQueryResults: {
          getItems: get('payload.data.connections')
        }
      }
    }
  }
}
