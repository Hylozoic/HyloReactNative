import gql from 'graphql-tag'
import { FETCH_GROUP_MODERATORS } from 'store/constants'

export default function fetchGroupModerators ({ id, slug }) {
  return {
    type: FETCH_GROUP_MODERATORS,
    graphql: {
      query: gql`
        query GroupModeratorsQuery ($id: ID, $slug: String) {
          group (id: $id, slug: $slug) {
            id
            moderators {
              items {
                id
                name
                avatarUrl
              }
            }
          }
        }
      `,
      variables: {
        id,
        slug
      }
    },
    meta: {
      extractModel: 'Group',
      id,
      slug
    }
  }
}
