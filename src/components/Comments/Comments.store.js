import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { FETCH_COMMENTS } from 'store/constants'
import orm from 'store/models'

export const MODULE_NAME = 'Comments'

export const getComments = ormCreateSelector(
  orm,
  state => state.orm,
  (_, props) => props.postId,
  (session, id) => {
    if (!session.Post.hasId(id)) return []
    const post = session.Post.withId(id)

    return {
      comments: post.comments.orderBy(c => Number(c.id)).toModelArray(),
      total: post.commentsTotal
    }
  }
)

const getCommentResults = makeGetQueryResults(FETCH_COMMENTS)

export const getHasMoreComments = createSelector(
  getCommentResults,
  get('hasMore')
)
