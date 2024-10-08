import { has } from 'lodash/fp'
import { noncircular } from 'util/index'
import { showMessagesBadge } from 'store/reducers/ormReducer/util'

const MODULE_NAME = 'SocketListener'
export const RECEIVE_MESSAGE = `${MODULE_NAME}/RECEIVE_MESSAGE`
export const RECEIVE_COMMENT = `${MODULE_NAME}/RECEIVE_COMMENT`
export const RECEIVE_POST = `${MODULE_NAME}/RECEIVE_POST`
export const RECEIVE_THREAD = `${MODULE_NAME}/RECEIVE_THREAD`
export const RECEIVE_NOTIFICATION = `${MODULE_NAME}/RECEIVE_NOTIFICATION`
export const HANDLE_EVENT = `${MODULE_NAME}/HANDLE_EVENT`

export function receiveMessage (message, opts = {}) {
  return {
    type: RECEIVE_MESSAGE,
    payload: {
      data: {
        message
      }
    },
    meta: {
      extractModel: 'Message',
      bumpUnreadCount: opts.bumpUnreadCount
    }
  }
}

export function receiveComment (comment) {
  return {
    type: RECEIVE_COMMENT,
    payload: {
      data: {
        comment
      }
    },
    meta: {
      extractModel: 'Comment'
    }
  }
}

export function receiveThread (thread) {
  return {
    type: RECEIVE_THREAD,
    payload: {
      data: {
        thread
      }
    },
    meta: {
      extractModel: 'MessageThread'
    }
  }
}

export function receivePost (post) {
  return {
    type: RECEIVE_POST,
    payload: {
      data: {
        post
      }
    },
    meta: {
      extractModel: 'Post'
    }
  }
}

export function receiveNotification (notification) {
  return {
    type: RECEIVE_NOTIFICATION,
    payload: {
      data: {
        notification
      }
    },
    meta: {
      extractModel: 'Notification'
    }
  }
}

export function handleEvent (name, value) {
  if (has('description.target', value)) {
    value.description.target = null
    value.description.currentTarget = null
  }
  return {
    type: HANDLE_EVENT,
    payload: { name, value: noncircular(value) }
  }
}

export default function reducer (state = {}, action) {
  if (action.type === HANDLE_EVENT) {
    const events = state.events || {}
    const { name, value } = action.payload
    const newState = {
      ...state,
      events: {
        ...events,
        [name]: {
          count: (events[name] ? events[name].count : 0) + 1,
          latest: new Date(),
          value: value && value.message ? value.message : value
        }
      }
    }

    // toggle connected boolean status
    if (['connect', 'reconnect'].includes(name)) {
      newState.connected = true
    } else if (name === 'disconnect') {
      newState.connected = false
    }

    return newState
  }
  return state
}

export function ormSessionReducer (session, action) {
  const { Me, MessageThread, Post } = session
  const { type, payload } = action

  switch (type) {
    case RECEIVE_NOTIFICATION:
      // TODO: eventually we might want to refactor this out into a more
      // structured activity.action handler for the various counts that need
      // bumping (or handle every single damn thing in ModelExtractor).
      const { notification: { activity } } = payload.data
      Me.first().increment('newNotificationCount')

      if (activity.action === 'newComment' && Post.idExists(activity.post.id)) {
        const post = Post.withId(activity.post.id)
        post.increment('commentsTotal')
      }
      break

    case RECEIVE_THREAD:
      Me.first().increment('unseenThreadCount')
      break

    case RECEIVE_MESSAGE:
      const { message: { messageThread, createdAt } } = payload.data
      if (MessageThread.idExists(messageThread)) {
        MessageThread.withId(messageThread).update({ updatedAt: createdAt })
      }

      showMessagesBadge(session)
      break
  }
}
