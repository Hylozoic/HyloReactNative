import { get } from 'lodash/fp'
import { FETCH_PEOPLE_AUTOCOMPLETE } from '../constants'

export const fetchPeopleAutocompleteQuery =
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

export function scopedFetchPeopleAutocomplete (scope) {
  const queryResultsScopedType = scope
    ? `${scope}/${FETCH_PEOPLE_AUTOCOMPLETE}`
    : FETCH_PEOPLE_AUTOCOMPLETE

  return function (
    autocomplete,
    first = 10,
    query = fetchPeopleAutocompleteQuery
  ) {
    return {
      type: queryResultsScopedType,
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
}

export default scopedFetchPeopleAutocomplete()
