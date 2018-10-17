import { get, isEmpty, includes } from 'lodash/fp'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const MODULE_NAME = 'PeopleChooser'
export const SET_PERSON_INPUT = `${MODULE_NAME}/SET_PERSON_INPUT`
export const FETCH_SUGGESTIONS = `${MODULE_NAME}/FETCH_SUGGESTIONS`
export const FETCH_RECENT_CONTACTS = `${MODULE_NAME}/FETCH_RECENT_CONTACTS`

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

export function fetchSuggestions (autocomplete, first = 10) {
  return {
    type: FETCH_SUGGESTIONS,
    graphql: {
      query: fetchPeopleQuery,
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

export function fetchRecentContacts (first = 6) {
  return {
    type: FETCH_RECENT_CONTACTS,
    graphql: {
      query: fetchRecentContactsQuery,
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

export const defaultState = {
  input: ''
}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_PERSON_INPUT:
      return {
        ...state,
        input: payload
      }
  }
  return state
}

export function setPersonInput (input) {
  return {
    type: SET_PERSON_INPUT,
    payload: input
  }
}

export function getInputText (state) {
  return get('input', state[MODULE_NAME])
}

const getRecentContactsResults = makeGetQueryResults(FETCH_RECENT_CONTACTS)

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

const getSuggestionsResults = makeGetQueryResults(FETCH_SUGGESTIONS)

export const getSuggestions = ormCreateSelector(
  orm,
  state => state.orm,
  getSuggestionsResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Person.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toModelArray()
  }
)
