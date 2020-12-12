import { uniqueId } from 'lodash/fp'
import { divToP } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = 'CommentEditor'
export const SET_COMMENT_EDITS = `${MODULE_NAME}/SET_COMMENT_EDITS`
export const CREATE_COMMENT = `${MODULE_NAME}/CREATE_COMMENT`
export const EDIT_COMMENT = `${MODULE_NAME}/CREATE_COMMENT`
export const UPDATE_COMMENT = `${MODULE_NAME}/UPDATE_COMMENT_PENDING`

export function setCommentEdits (postId, text, commentId) {
  return {
    type: SET_COMMENT_EDITS,
    payload: { text, postId, commentId }
  }
}

export default function reducer (state = {}, action) {
  const { type, payload, meta } = action
  switch (type) {
    case SET_COMMENT_EDITS:
      return { ...state, [payload.postId]: { text: payload.text, id: payload.commentId } }
    case CREATE_COMMENT:
      return { ...state, [meta.postId]: null }
  }
  return state
}

export function getCommentEdits (state, { postId }) {
  return state[MODULE_NAME][postId]
}

export function createComment (postId, text) {
  const preprocessedText = divToP(text)
  return {
    type: CREATE_COMMENT,
    graphql: {
      query: `mutation ($postId: String, $text: String) {
        createComment(data: {postId: $postId, text: $text}) {
          id
          text
          post {
            id
          }
          createdAt
          creator {
            id
          }
        }
      }`,
      variables: {
        postId,
        text: preprocessedText
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Comment',
      tempId: uniqueId(`post${postId}_`),
      postId,
      text: preprocessedText,
      analytics: AnalyticsEvents.COMMENT_CREATED
    }
  }
}

export function updateComment (id, text) {
  return {
    type: UPDATE_COMMENT,
    graphql: {
      query: `mutation ($id: ID, $data: CommentInput) {
        updateComment(id: $id, data: $data) {
            id
            text
        }
      }`,
      variables: {
        id,
        data: {
          text
        }
      }
    },
    meta: {
      optimistic: true,
      id,
      data: {
        text
      }
    }
  }
}
