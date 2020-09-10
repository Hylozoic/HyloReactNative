export const MODULE_NAME = 'CommunitySettings'
export const FETCH_COMMUNITY_SETTINGS = `${MODULE_NAME}/FETCH_COMMUNITY_SETTINGS`
export const UPDATE_COMMUNITY_SETTINGS = `${MODULE_NAME}/UPDATE_COMMUNITY_SETTINGS`
export const UPDATE_COMMUNITY_SETTINGS_PENDING = UPDATE_COMMUNITY_SETTINGS + '_PENDING'

export function fetchCommunitySettings (id) {
  return {
    type: FETCH_COMMUNITY_SETTINGS,
    graphql: {
      query: `query ($id: ID) {
        community (id: $id) {
          id
          name
          slug
          avatarUrl
          bannerUrl
          description
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
          settings
          invitePath
          hidden
          allowCommunityInvites
          pendingInvitations (first: 100) {
            hasMore
            items {
              id
              email
              createdAt
              lastSentAt
            }
          }
          moderators (first: 100) {
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      extractModel: 'Community',
      id
    }
  }
}

export function updateCommunitySettings (id, changes) {
  return {
    type: UPDATE_COMMUNITY_SETTINGS,
    graphql: {
      query: `mutation ($id: ID, $changes: CommunityInput) {
        updateCommunitySettings(id: $id, changes: $changes) {
          id
        }
      }`,
      variables: {
        id, changes
      }
    },
    meta: {
      id,
      changes,
      optimistic: true
    }
  }
}
