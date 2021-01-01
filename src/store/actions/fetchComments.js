import { get } from 'lodash/fp'
import { FETCH_COMMENTS } from 'store/constants'

export default function fetchComments (id, opts = {}) {
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
