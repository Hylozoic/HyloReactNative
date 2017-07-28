import { createSelector } from 'redux-orm'
import { get, pick } from 'lodash/fp'
import { humanDate, sanitize } from 'hylo-utils/text'

import orm from '../../store/models'
import { makeGetQueryResults } from '../../store/reducers/queryResults'

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

export function updateThreadReadTime (id) {
  return {
    type: UPDATE_THREAD_READ_TIME,
    payload: {api: {path: `/noo/post/${id}/update-last-read`, method: 'POST'}},
    meta: {id}
  }
}

function refineMessages ({ id, createdAt, text, creator }) {
  return {
    id,
    createdAt: humanDate(createdAt),
    text: sanitize(text),
    creator: pick([ 'id', 'name', 'avatarUrl' ], creator.ref)
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

export const getMyAvatar = createSelector(
  orm,
  state => state.orm,
  session => {
    console.log('ME', session.Me.first())
    session.Me.first().avatarUrl
  }
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
