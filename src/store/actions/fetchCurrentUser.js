export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER'

export default function fetchCurrentUser () {
  return {
    type: FETCH_CURRENT_USER,
    graphql: {
      query: `{
        me {
          id
          name
          avatarUrl
          newNotificationCount
          unseenThreadCount
          memberships {
            id
            lastViewedAt
            newPostCount
            hasModeratorRole
            community {
              id
              name
              slug
              avatarUrl
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
