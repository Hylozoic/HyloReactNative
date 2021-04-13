import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_COMMENTS } from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'

const normaliseCommentModel = comment => ({
  ...comment.ref,
  creator: comment.creator,
  attachments: comment.attachments
    .orderBy('position').toRefArray(),
})

export const getComments = createSelector(
  state => orm.session(state.orm),
  (_, props) => props.commentId,
  (_, props) => props.postId,
  ({ Post, Comment }, commentId, postId) => {
    if (commentId) {
      return Comment.filter({ parentComment: commentId })
        .orderBy(c => -Number(c.id))
        .toModelArray()
        .map(normaliseCommentModel)
    } else {
      const post = Post.withId(postId)

      if (!post) return []
  
      return post.comments.filter({ parentComment: null })
        .orderBy(c => -Number(c.id))
        .toModelArray()
        .map(normaliseCommentModel)
    }
  }
)

const getCommentResults = makeGetQueryResults(FETCH_COMMENTS)

export const getHasMoreComments = createSelector(
  getCommentResults,
  get('hasMore')
)

export const getTotalComments = createSelector(
  getCommentResults,
  get('total')
)
