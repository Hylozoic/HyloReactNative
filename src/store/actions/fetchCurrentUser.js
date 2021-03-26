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
          bio
          tagline    
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
          memberships {
            id
            lastViewedAt
            newPostCount
            hasModeratorRole
            settings {
              sendEmail
              sendPushNotifications
            }
            person {
              id
            }
            group {
              id
              name
              slug
              memberCount
              avatarUrl
              bannerUrl
              groupTopics(subscribed: true) {
                total
                hasMore
                items {
                  id
                  topic {
                    id
                    name
                  }
                  newPostCount
                  postsTotal
                  followersTotal
                  isSubscribed
                }
              }
              parentGroups {
                items {
                  id
                  avatarUrl
                  bannerUrl
                  memberCount
                  name
                  slug
                }
              }
              childGroups(first: 300) {
                items {
                  id
                  avatarUrl
                  bannerUrl
                  memberCount
                  name
                  slug
                }
              }
            }
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
