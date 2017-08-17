import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, pick, uniqueId } from 'lodash/fp'
import { humanDate, sanitize } from 'hylo-utils/text'

import orm from '../../store/models'
import { makeGetQueryResults } from '../../store/reducers/queryResults'

export const CREATE_MESSAGE = 'Thread/CREATE_MESSAGE'
export const CREATE_MESSAGE_PENDING = `${CREATE_MESSAGE}_PENDING`
export const FETCH_MESSAGES = 'Thread/FETCH_MESSAGES'
export const UPDATE_THREAD_READ_TIME = 'Thread/UPDATE_THREAD_READ_TIME'

const MESSAGE_PAGE_SIZE = 20

export function fetchMessages (id, opts = {}) {
  const variables = { id, messagePageSize: MESSAGE_PAGE_SIZE }
  if (opts.cursor) variables.cursor = opts.cursor

  return {
    type: FETCH_MESSAGES,
    graphql: {
      query: `
        query ($id: ID, $cursor: ID, $messagePageSize: Int) {
          messageThread (id: $id) {
            id
            messages(first: $messagePageSize, cursor: $cursor, order: "desc") {
              items {
                id
                createdAt
                text
                creator {
                  id
                }
              }
              total
              hasMore
            }
            participants {
              id
              name
              avatarUrl
            }
          }
        }
      `,
      variables
    },
    meta: {
      extractModel: 'MessageThread',
      extractQueryResults: {
        getItems: get('payload.data.messageThread.messages')
      },
      reset: opts.reset,
      id
    }
  }
}

export function createMessage (messageThreadId, text) {
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
        optimistic: true,
        text
      }
    },
    meta: {
      extractModel: 'Message',
      messageThreadId,
      optimistic: true,
      tempId: uniqueId(`messageThread${messageThreadId}_`),
      text
    }
  }
}

export function updateThreadReadTime (id) {
  return {
    type: UPDATE_THREAD_READ_TIME,
    payload: {api: {path: `/noo/post/${id}/update-last-read`, method: 'POST'}},
    meta: {id}
  }
}

function refineMessages ({ id, createdAt, text, creator }) {
  const creatorFields = pick([ 'id', 'name', 'avatarUrl' ], creator.ref)
  return {
    id,
    createdAt: humanDate(createdAt),
    text: sanitize(text),
    creator: creatorFields
  }
}

// NOTE: descending order to accommodate inverted FlatList
function refineThread (session, id) {
  if (session.MessageThread.hasId(id)) {
    const thread = session.MessageThread.withId(id)
    const messages = thread.messages
      .orderBy(m => Number(m.id), 'desc')
      .toModelArray()
      .map(refineMessages)
    const title = threadNames(thread.participants.toRefArray().map(firstName))
    return {
      id: thread.id,
      messages,
      title
    }
  }
  return null
}

// TODO: replace with hylo-utils/text/threadNames
function threadNames (names) {
  if (names.length < 3) return names.join(' & ')
  return `${names[0]} & ${names.length - 1} others`
}

const firstName = person => person.name.split(' ')[0]

export const getThread = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { navigation }) => navigation.state.params.id,
  refineThread
)

export const getMeForThread = ormCreateSelector(
  orm,
  state => state.orm,
  session => pick(['id', 'avatarUrl'], session.Me.first().ref)
)

const getMessageResults = makeGetQueryResults(FETCH_MESSAGES)

export const getHasMoreMessages = createSelector(
  getMessageResults,
  get('hasMore')
)
