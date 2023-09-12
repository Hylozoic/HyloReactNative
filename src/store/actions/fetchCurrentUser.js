import { FETCH_CURRENT_USER } from 'store/constants'
import gql from 'graphql-tag'

export default function fetchCurrentUser () {
  return {
    type: FETCH_CURRENT_USER,
    graphql: {
      // TODO: Reconcile with hylo-evo MeQuery
      query: gql`
        query MeQueryApp {
          me {
            id
            name
            email
            emailValidated
            hasRegistered
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
              alreadySeenTour
              digestFrequency
              dmNotifications
              commentNotifications
              signupInProgress
              streamChildPosts
              streamViewMode
              streamSortBy
              streamPostType
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
            affiliations {
              items {
                id
                role
                preposition
                orgName
                url
                createdAt
                updatedAt
                isActive
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
                customViews {
                  items {
                    id
                    activePostsOnly
                    collectionId
                    defaultSort
                    defaultViewMode
                    externalLink
                    groupId
                    isActive
                    icon
                    name
                    order
                    postTypes
                    topics {
                      id
                      name
                    }
                    type
                  }
                }
                description
                id
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
        }
      `
    },
    meta: {
      afterInteractions: true,
      extractModel: 'Me'
    }
  }
}
