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
              locale
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
                agreementsAcceptedAt
                joinQuestionsAnsweredAt
                sendEmail
                sendPushNotifications
                showJoinForm
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
                purpose
                slug
                memberCount
                visibility
                agreements {
                  items {
                    id
                    description
                    order
                    title
                  }
                }
                // REMOVE BEGIN
                childGroups(first: 300) {
                  items {
                    accessibility
                    avatarUrl
                    bannerUrl
                    description
                    memberCount
                    id
                    name
                    slug
                    visibility
                    settings {
                      allowGroupInvites
                      askGroupToGroupJoinQuestions
                      askJoinQuestions
                      hideExtensionData
                      locationDisplayPrecision
                      publicMemberDirectory
                      showSuggestedSkills
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
                // REMOVE END
                settings {
                  allowGroupInvites
                  askJoinQuestions
                }
                suggestedSkills {
                  items {
                    id
                    name
                  }
                }
                joinQuestions {
                  items {
                    id
                    questionId
                    text
                  }
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
