/**
 * @providesModule store/actions/fetchCurrentUser
 */

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
          intercomHash
          memberships {
            id
            lastViewedAt
            newPostCount
            hasModeratorRole
            settings {
              sendPushNotifications
              sendEmail
            }
            community {
              id
              name
              slug
              avatarUrl
              bannerUrl
              network {
                id
                name
                slug
                avatarUrl
                bannerUrl
                communities(first: 300) {
                  items {
                    id
                    name
                    slug
                    avatarUrl
                    network {
                      id
                    }
                  }
                }
              }
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
            dmNotifications
          }
        }
      }`
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Me'
    }
  }
}
