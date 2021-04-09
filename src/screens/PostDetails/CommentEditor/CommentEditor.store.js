import { CREATE_COMMENT } from 'store/constants'

export const MODULE_NAME = 'CommentEditor'
export const SET_COMMENT_EDITS = `${MODULE_NAME}/SET_COMMENT_EDITS`

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
