import { uniqueId } from 'lodash/fp'

export const MODULE_NAME = 'NewMessage'
export const SET_MESSAGE = `${MODULE_NAME}/SET_MESSAGE`
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
      forNewThread,
      analytics: AnalyticsEvents.DIRECT_MESSAGE_SENT
    }
  }
}

export const defaultState = {
  message: ''
}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_MESSAGE:
      return {
        ...state,
        message: payload
      }
    case CREATE_MESSAGE:
      return {
        ...state,
        message: ''
      }
  }
  return state
}

export function setMessage (input) {
  return {
    type: SET_MESSAGE,
    payload: input
  }
}

export function getMessage (state) {
  return state[MODULE_NAME].message
}
