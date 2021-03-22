export const MODULE_NAME = 'GroupSettings'
export const FETCH_GROUP_SETTINGS = `${MODULE_NAME}/FETCH_GROUP_SETTINGS`
export const UPDATE_GROUP_SETTINGS = `${MODULE_NAME}/UPDATE_GROUP_SETTINGS`
export const UPDATE_GROUP_SETTINGS_PENDING = UPDATE_GROUP_SETTINGS + '_PENDING'

export function fetchGroupSettings (id) {
  return {
    type: FETCH_GROUP_SETTINGS,
    graphql: {
      query: `query ($id: ID) {
        group (id: $id) {
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
          allowGroupInvites
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
      extractModel: 'Group',
      id
    }
  }
}

export function updateGroupSettings (id, changes) {
  return {
    type: UPDATE_GROUP_SETTINGS,
    graphql: {
      query: `mutation ($id: ID, $changes: GroupInput) {
        updateGroupSettings(id: $id, changes: $changes) {
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
