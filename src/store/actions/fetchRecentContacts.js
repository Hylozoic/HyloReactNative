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

export default function fetchRecentContacts (first = 6, query = fetchRecentContactsQuery) {
  return {
    type: FETCH_RECENT_CONTACTS,
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
