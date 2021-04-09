import { FETCH_CHILD_COMMENTS } from 'store/constants'
import { get } from 'lodash/fp'
import subCommentsQuery from 'graphql/queries/subCommentsQuery'

export default function fetchChildComments (id, opts = {}) {
  const { cursor } = opts

  return {
    type: FETCH_CHILD_COMMENTS,
    graphql: {
      query: subCommentsQuery,
      variables: {
        id,
        cursor: cursor || null
      }
    },
    meta: {
      extractModel: 'Comment',
      extractQueryResults: {
        getItems: get('payload.data.comment.childComments')
      }
    }
  }
}
