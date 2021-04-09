import { FETCH_COMMENTS } from 'store/constants'
import { get } from 'lodash/fp'
import commentsQuery from 'graphql/queries/commentsQuery'

export default function fetchComments (id, opts = {}) {
  const { cursor } = opts

  return {
    type: FETCH_COMMENTS,
    graphql: {
      query: commentsQuery,
      variables: {
        id,
        cursor: cursor || null
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
