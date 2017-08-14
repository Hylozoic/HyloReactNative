import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { makeGetQueryResults } from '../../store/reducers/queryResults'
import orm from '../../store/models'

export const MODULE_NAME = 'Comments'
export const FETCH_COMMENTS = `${MODULE_NAME}/FETCH_COMMENTS`

export function fetchComments (id, opts = {}) {
  return {
    type: FETCH_COMMENTS,
    graphql: {
      query: `query ($id: ID, $cursor: ID) {
        post(id: $id) {
          id
          comments(first: 10, cursor: $cursor, order: "desc") {
            items {
              id
              text
              creator {
                id
                name
                avatarUrl
              }
              createdAt
            }
            total
            hasMore
          }
        }
      }`,
      variables: {
        id,
        cursor: opts.cursor
      }
    },
    meta: {
      extractModel: 'Post',
      extractQueryResults: {
        getItems: get('payload.data.post.comments')
      }
    }
  }
}

export const getComments = createSelector(
  state => orm.session(state.orm),
  (state, props) => props.postId,
  (session, id) => {
    var post
    try {
      post = session.Post.get({id})
    } catch (e) {
      return []
    }
    return post.comments.orderBy(c => Number(c.id)).toModelArray()
  })

const getCommentResults = makeGetQueryResults(FETCH_COMMENTS)

export const getHasMoreComments = createSelector(
  getCommentResults,
  get('hasMore')
)

export const getTotalComments = createSelector(
  getCommentResults,
  get('total')
)
