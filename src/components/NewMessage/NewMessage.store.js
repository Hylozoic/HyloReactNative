import { pick, get, isEmpty, includes, uniqueId } from 'lodash/fp'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const MODULE_NAME = 'NewMessage'
export const SET_CONTACT_INPUT = `${MODULE_NAME}/SET_CONTACT_INPUT`
export const SET_MESSAGE = `${MODULE_NAME}/SET_MESSAGE`
export const SET_PARTICIPANTS = `${MODULE_NAME}/SET_PARTICIPANTS`
export const ADD_PARTICIPANT = `${MODULE_NAME}/ADD_PARTICIPANT`
export const REMOVE_PARTICIPANT = `${MODULE_NAME}/REMOVE_PARTICIPANT`
export const FETCH_SUGGESTIONS = `${MODULE_NAME}/FETCH_SUGGESTIONS`
export const FETCH_CONTACTS = `${MODULE_NAME}/FETCH_CONTACTS`
export const FETCH_RECENT_CONTACTS = `${MODULE_NAME}/FETCH_RECENT_CONTACTS`
export const CREATE_MESSAGE = `${MODULE_NAME}/CREATE_MESSAGE`
export const FIND_OR_CREATE_THREAD = `${MODULE_NAME}/FIND_OR_CREATE_THREAD`

const findOrCreateThreadQuery =
`mutation ($participantIds: [String]) {
  findOrCreateThread(data: {participantIds: $participantIds}) {
    id
    createdAt
    updatedAt
    participants {
      id
      name
      avatarUrl
    }
  }
}`

export function findOrCreateThread (participantIds) {
  return {
    type: FIND_OR_CREATE_THREAD,
    graphql: {
      query: findOrCreateThreadQuery,
      variables: {participantIds}
    },
    meta: { extractModel: 'MessageThread' }
  }
}

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

const fetchContactsQuery =
`query PeopleContacts ($first: Int) {
  people (first: $first) {
    items {
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
  }
}`

export function fetchContacts (first = 10) {
  return {
    type: FETCH_CONTACTS,
    graphql: {
      query: fetchContactsQuery,
      variables: { first }
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

export function createMessage (messageThreadId, text, forNewThread) {
  return {
    type: CREATE_MESSAGE,
    graphql: {
      query: `mutation ($messageThreadId: String, $text: String) {
        createMessage(data: {messageThreadId: $messageThreadId, text: $text}) {
          id
          text
          createdAt
          creator {
            id
          }
          messageThread {
            id
          }
        }
      }`,
      variables: {
        messageThreadId,
        text
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Message',
      tempId: uniqueId(`messageThread${messageThreadId}_`),
      messageThreadId,
      text,
      forNewThread
    }
  }
}

export const defaultState = {
  input: '',
  message: '',
  participants: []
}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_CONTACT_INPUT:
      return {
        ...state,
        input: payload
      }
    case SET_MESSAGE:
      return {
        ...state,
        message: payload
      }
    case SET_PARTICIPANTS:
      return {
        ...state,
        participants: payload
      }
    case ADD_PARTICIPANT:
      return {
        ...state,
        input: '',
        participants: [ ...state.participants, payload ]
      }
    case REMOVE_PARTICIPANT:
      if (payload) {
        return {
          ...state,
          participants: state.participants.filter(p => p !== payload)
        }
      }
      break
    case CREATE_MESSAGE:
      return {
        ...state,
        message: null
      }
  }
  return state
}

export function setParticipantInput (input) {
  return {
    type: SET_CONTACT_INPUT,
    payload: input
  }
}

export function setMessage (input) {
  return {
    type: SET_MESSAGE,
    payload: input
  }
}

export function setParticipants (participantIds) {
  return {
    type: SET_PARTICIPANTS,
    payload: participantIds
  }
}

export function addParticipant (id) {
  return {
    type: ADD_PARTICIPANT,
    payload: id
  }
}

export function removeParticipant (id) {
  return {
    type: REMOVE_PARTICIPANT,
    payload: id
  }
}

export function getMessage (state) {
  return state[MODULE_NAME].message
}

export function getInputText (state) {
  return state[MODULE_NAME].input
}

export function getParticipantIds (state) {
  return state[MODULE_NAME].participants
}

export const getParticipants = ormCreateSelector(
  orm,
  state => state.orm,
  getParticipantIds,
  (session, fromStore) => fromStore.map(id =>
    pick([ 'id', 'name', 'avatarUrl' ], session.Person.withId(id).ref))
)

const getContactsResults = makeGetQueryResults(FETCH_CONTACTS)

export const getContacts = ormCreateSelector(
  orm,
  state => state.orm,
  getParticipantIds,
  getContactsResults,
  (session, participantsIds, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Person.all()
    .filter(x => includes(x.id, results.ids) && !includes(x.id, participantsIds))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

const getRecentContactsResults = makeGetQueryResults(FETCH_RECENT_CONTACTS)

export const getRecentContacts = ormCreateSelector(
  orm,
  state => state.orm,
  getParticipantIds,
  getRecentContactsResults,
  (session, participantsIds, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.PersonConnection.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
    .map(pc => pc.person)
    .filter(p => !includes(p.id, participantsIds))
  }
)

const getSuggestionsResults = makeGetQueryResults(FETCH_SUGGESTIONS)

export const getSuggestions = ormCreateSelector(
  orm,
  state => state.orm,
  getParticipantIds,
  getSuggestionsResults,
  (session, participantsIds, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Person.all()
    .filter(x => includes(x.id, results.ids) && !includes(x.id, participantsIds))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)
