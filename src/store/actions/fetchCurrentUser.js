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
          joinRequests(status: 0) {
            items {
              id
              status
              createdAt
              group {
                id
              }
            }
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
              accessibility
              avatarUrl
              bannerUrl
              description
              id
              memberCount
              name
              slug
              visibility
              childGroups(first: 300) {
                items {
                  accessibility
                  avatarUrl
                  bannerUrl
                  description
                  id
                  memberCount
                  name
                  slug
                  visibility
                  settings {
                    allowGroupInvites
                    askJoinQuestions
                    publicMemberDirectory
                  }
                }
              }
              groupTopics(subscribed: true) {
                total
                hasMore
                items {
                  followersTotal
                  id
                  isSubscribed
                  newPostCount
                  postsTotal
                  topic {
                    id
                    name
                  }
                }
              }
              parentGroups {
                items {
                  accessibility
                  avatarUrl
                  bannerUrl
                  description
                  id
                  memberCount
                  name
                  slug
                  visibility
                  settings {
                    allowGroupInvites
                    askJoinQuestions
                    publicMemberDirectory
                  }
                }
              }
              settings {
                allowGroupInvites
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
