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
          community {
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

export function fetchRecentContactsForScope (scope) {
  if (!scope) throw new Error('`scope` param is required for setting a querySearchTerm')

  const queryResultsScope = scope
    ? `${scope}/${FETCH_RECENT_CONTACTS}`
    : FETCH_RECENT_CONTACTS

  return function (
    first = 6,
    query = fetchRecentContactsQuery
  ) {
    return {
      type: queryResultsScope,
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

export default fetchRecentContactsForScope()
