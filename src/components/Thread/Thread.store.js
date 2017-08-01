import { createSelector } from 'redux-orm'
import { get, pick, uniqueId } from 'lodash/fp'
import { humanDate, sanitize } from 'hylo-utils/text'

import orm from '../../store/models'
import { makeGetQueryResults } from '../../store/reducers/queryResults'

export const CREATE_MESSAGE = 'Thread/CREATE_MESSAGE'
export const FETCH_MESSAGES = 'Thread/FETCH_MESSAGES'
export const UPDATE_THREAD_READ_TIME = 'Thread/UPDATE_THREAD_READ_TIME'

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/2a518750c39d5f59b4b1675492b0ba61?d=mm&s=140'

export function fetchMessages (id, opts = {}) {
  return {
    type: FETCH_MESSAGES,
    graphql: {
      query: `
        query ($id: ID, $cursor: ID) {
          messageThread (id: $id) {
            id
            messages(first: 20, cursor: $cursor, order: "desc") {
              items {
                id
                createdAt
                text
                creator {
                  id
                  name
                  avatarUrl
                }
              }
              total
              hasMore
            }
          }
        }
      `,
      variables: opts.cursor ? {id, cursor: opts.cursor} : {id}
    },
    meta: {
      extractModel: 'MessageThread',
      reset: opts.reset,
      id
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

export function updateThreadReadTime (id) {
  return {
    type: UPDATE_THREAD_READ_TIME,
    payload: {api: {path: `/noo/post/${id}/update-last-read`, method: 'POST'}},
    meta: {id}
  }
}

function refineMessages ({ id, createdAt, text, creator }) {
  const creatorFields = pick([ 'id', 'name', 'avatarUrl' ], creator.ref)
  if (!creatorFields.avatarUrl) creatorFields.avatarUrl = DEFAULT_AVATAR
  return {
    id,
    createdAt: humanDate(createdAt),
    text: sanitize(text),
    creator: creatorFields
  }
}

export const getMessages = createSelector(
  orm,
  state => state.orm,
  (_, { navigation }) => navigation.state.params.id,
  (session, id) => {
    if (session.MessageThread.hasId(id)) {
      const messages = session.MessageThread
        .withId(id)
        .messages
        .orderBy(m => Number(m.id))
        .toModelArray()
      return messages.map(refineMessages)
    }
    return []
  })

export const getMeForThread = createSelector(
  orm,
  state => state.orm,
  session => pick(['id', 'avatarUrl'], session.Me.first().ref)
)

const getMessageResults = makeGetQueryResults(FETCH_MESSAGES)

export const getHasMoreMessages = createSelector(
  getMessageResults,
  get('hasMore')
)

export const getTotalMessages = createSelector(
  getMessageResults,
  get('total')
)
