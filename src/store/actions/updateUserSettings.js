import { UPDATE_USER_SETTINGS } from 'store/constants'

export default function updateUserSettings (changes) {
  return {
    type: UPDATE_USER_SETTINGS,
    graphql: {
      query: `mutation ($changes: MeInput) {
        updateMe(changes: $changes) {
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
          intercomHash
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
      }`,
      variables: {
        changes
      }
    },
    meta: {
      optimistic: true,
      changes
    }
  }
}
