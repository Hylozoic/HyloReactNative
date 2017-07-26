import { createSelector } from 'redux-orm'
import { get } from 'lodash/fp'

import orm from '../../store/models'
import { makeGetQueryResults } from '../../store/reducers/queryResults'

export const FETCH_MESSAGES = 'Thread/FETCH_MESSAGES'
export const UPDATE_THREAD_READ_TIME = 'Thread/UPDATE_THREAD_READ_TIME'

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

export const getMessages = createSelector(
  orm,
  state => state.orm,
  (_, { navigation }) => navigation.state.params.id,
  (session, id) => {
    if (session.MessageThread.hasId(id)) {
      return session.MessageThread.withId(id).messages.orderBy(c => Number(c.id)).toModelArray()
    }
    return []
  })


const getMessageResults = makeGetQueryResults(FETCH_MESSAGES)

export const getHasMoreMessages = createSelector(
  getMessageResults,
  get('hasMore')
)

export const getTotalMessages = createSelector(
  getMessageResults,
  get('total')
)
