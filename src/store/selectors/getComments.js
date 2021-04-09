import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_COMMENTS } from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'

const naturalOrdering = c => Number(c.id)

const normaliseCommentModel = post => comment => {
  const commentModel = {
    ...comment.ref,
    creator: comment.creator,
    attachments: comment.attachments
      .orderBy('position').toRefArray(),
  }
  if (post) {
    commentModel.childComments = post.comments.filter({ parentComment: comment.id })
      .orderBy(naturalOrdering).toModelArray()
      .map(normaliseCommentModel(post))
  }

  return  commentModel
}

export const getComments = createSelector(
  state => orm.session(state.orm),
  (_, props) => props.postId,
  (_, props) => props.commentId,
  ({ Post, Comment }, postId, commentId) => {
    let comments

    if (commentId) {
      comments = Comment.filter({ parentComment: commentId })
        .toModelArray()
        .map(normaliseCommentModel())
    } else if (postId) {
      const post = Post.withId(postId)

      if (!post) return []
  
      comments = post.comments.filter({ parentComment: null })
        // .orderBy(naturalOrdering)
        .toModelArray()
        .map(normaliseCommentModel(post))
    }

    return comments
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
