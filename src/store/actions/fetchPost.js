import { get } from 'lodash/fp'
import { FETCH_POST, FETCH_COMMENTS } from 'store/constants'

export default function fetchPost (id, opts = {
  withComments: false
}) {
  return {
    type: FETCH_POST,
    graphql: {
      query: `query ($id: ID) {
        post(id: $id) {
          ${postFieldsFragment(opts.withComments)}
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Post',
      extractQueryResults: {
        getItems: get('payload.data.post.comments'),
        getType: () => FETCH_COMMENTS
      }
    }
  }
}
