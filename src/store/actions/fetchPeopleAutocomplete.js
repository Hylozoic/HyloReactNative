import { get } from 'lodash/fp'
import { FETCH_PEOPLE_AUTOCOMPLETE } from '../constants'

const fetchPeopleQuery =
`query PeopleAutocomplete ($autocomplete: String, $first: Int) {
  people (autocomplete: $autocomplete, first: $first) {
    items {
      id
      name
      avatarUrl
      memberships {
        id
        community {
          id
          name
        }
      }
    }
  }
}`

export default function fetchPeopleAutocomplete (autocomplete, first = 10, query = fetchPeopleQuery) {
  return {
    type: FETCH_PEOPLE_AUTOCOMPLETE,
    graphql: {
      query,
      variables: { autocomplete, first }
    },
    meta: {
      extractModel: 'Person',
      extractQueryResults: {
        getItems: get('payload.data.people')
      }
    }
  }
}
