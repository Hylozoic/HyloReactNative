import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { makeGetQueryResults } from '../../store/reducers/queryResults'

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
      extractModel: 'Post'
    }
  }
}

const getCommentResults = makeGetQueryResults(FETCH_COMMENTS)

export const getHasMoreComments = createSelector(
  getCommentResults,
  get('hasMore')
)

export const getTotalComments = createSelector(
  getCommentResults,
  get('total')
)
