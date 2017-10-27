import { get } from 'lodash/fp'

export const FETCH_THREADS = `FETCH_THREADS`

export default function fetchThreads (first = 10, offset = 0, reset) {
  return {
    type: FETCH_THREADS,
    graphql: {
      query: `query ($first: Int, $offset: Int) {
        me {
          id
          messageThreads(sortBy: "updatedAt", order: "desc", first: $first, offset: $offset) {
            total
            hasMore
            items {
              id
              unreadCount
              lastReadAt
              createdAt
              updatedAt
              participants {
                id
                name
                avatarUrl
              }
              messages(first: 1, order: "desc") {
                items {
                  id
                  createdAt
                  text
                  creator {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        first,
        offset
      }
    },
    meta: {
      extractModel: 'Me',
      extractQueryResults: {
        getItems: get('payload.data.me.messageThreads'),
        reset
      }
    }
  }
}
