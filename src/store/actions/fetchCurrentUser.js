import { FETCH_CURRENT_USER } from 'store/constants'

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
          locationObject {
            id
            addressNumber
            addressStreet
            bbox {
              lat
              lng
            }
            center {
              lat
              lng
            }
            city
            country
            fullText
            locality
            neighborhood
            region
          }
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
          blockedUsers {
            id
            name
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
