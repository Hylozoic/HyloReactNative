import { uniqueId } from 'lodash/fp'
import { divToP } from 'hylo-utils/text'

export const MODULE_NAME = 'CommentEditor'
export const SET_COMMENT_EDITS = `${MODULE_NAME}/SET_COMMENT_EDITS`
export const CREATE_COMMENT = `${MODULE_NAME}/CREATE_COMMENT`

export function setCommentEdits (postId, text) {
  return {
    type: SET_COMMENT_EDITS,
    payload: {text, postId}
  }
}

export default function reducer (state = {}, action) {
  const { type, payload, meta } = action
  switch (type) {
    case SET_COMMENT_EDITS:
      return {...state, [payload.postId]: payload.text}
    case CREATE_COMMENT:
      return {...state, [meta.postId]: null}
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
      text: preprocessedText
    }
  }
}
