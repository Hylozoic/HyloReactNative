export const FETCH_THREADS = `FETCH_THREADS`

export default function fetchThreads () {
  return {
    type: FETCH_THREADS,
    graphql: {
      query: `{
        me {
          id
          messageThreads(sortBy: "updatedAt", order: "desc") {
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
      }`
    },
    meta: {
      extractModel: 'Me'
    }
  }
}
