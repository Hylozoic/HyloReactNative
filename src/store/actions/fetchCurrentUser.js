export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER'

export default function fetchCurrentUser () {
  return {
    type: FETCH_CURRENT_USER,
    graphql: {
      query: `{
        me {
          id
          name
          email
          location
          avatarUrl
          facebookUrl
          twitterName
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
              bannerUrl
            }
          }
          skills (first: 100) {
            total
            hasMore
            items {
              id
              name
            }
          }
          settings {
            signupInProgress
          }
        }
      }`
    },
    meta: {
      extractModel: 'Me'
    }
  }
}
