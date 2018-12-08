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

export default function scopedFetchPeopleAutocomplete (scope) {
  if (!scope) throw new Error('`scope` param is required for setting a querySearchTerm')

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
