import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get, pick, uniqueId, isEmpty } from 'lodash/fp'
import { humanDate, sanitize, threadNames } from 'hylo-utils/text'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { firstName } from 'store/models/Person'

export const BATCH_MINUTES = 5
export const CREATE_MESSAGE = 'Thread/CREATE_MESSAGE'
export const CREATE_MESSAGE_PENDING = `${CREATE_MESSAGE}_PENDING`
export const FETCH_MESSAGES = 'Thread/FETCH_MESSAGES'
export const UPDATE_THREAD_READ_TIME = 'Thread/UPDATE_THREAD_READ_TIME'
export const UPDATE_THREAD_READ_TIME_PENDING = `${UPDATE_THREAD_READ_TIME}_PENDING`

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
      afterInteractions: true,
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
    payload: { api: { path: `/noo/post/${id}/update-last-read`, method: 'POST' } },
    meta: { id }
  }
}

export function isWithinBatchLimit (d1, d2) {
  const elapsed = (new Date(d1) - new Date(d2)) / 60000
  return elapsed <= BATCH_MINUTES
}

export function refineMessage ({ id, createdAt, creator, text }, i, messages) {
  const creatorFields = pick(['id', 'name', 'avatarUrl'], creator.ref)

  // This might seem counter-intuitive, because the list is reversed. These
  // values handle compact display of consecutive messages by the same creator
  // when received in MessageCard.
  const next = i > 0 && i < messages.length ? messages[i - 1] : null
  const prev = i > 0 && i < messages.length - 1 ? messages[i + 1] : null
  const suppressCreator = prev &&
    creator.id === prev.creator.id &&
    isWithinBatchLimit(createdAt, prev.createdAt)
  const suppressDate = next &&
    creator.id === next.creator.id &&
    isWithinBatchLimit(next.createdAt, createdAt)

  return {
    id,
    createdAt: humanDate(createdAt),
    creator: creatorFields,
    text: sanitize(text),
    suppressCreator,
    suppressDate
  }
}

// NOTE: descending order to accommodate inverted FlatList
export function presentThread (thread, currentUserId) {
  if (!thread) return null
  const otherParticipants = thread
    .participants
    .filter(p => p.id !== currentUserId)
    .toRefArray()
    // .map(firstName)
  let title
  if (isEmpty(otherParticipants)) {
    title = 'You'
  } else if (otherParticipants.length == 1) {
    title = otherParticipants[0].name
  } else {
    title = threadNames(otherParticipants.map(firstName))
  }
  return {
    id: thread.id,
    title
  }
}

export const getThread = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { route }) => route.params.id,
  ({ MessageThread }, id) => MessageThread.safeWithId(id)
)

export const getAndPresentMessages = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { route }) => route.params.id,
  ({ Message }, id) =>
    Message.filter(m => m.messageThread === id)
      .orderBy(m => Number(m.id), 'desc')
      .toModelArray()
      .map(refineMessage)
)

const getMessageResults = makeGetQueryResults(FETCH_MESSAGES)

export const getHasMoreMessages = createSelector(
  getMessageResults,
  get('hasMore')
)
