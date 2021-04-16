export const MODULE_NAME = 'GroupSettings'
export const FETCH_GROUP_SETTINGS = `${MODULE_NAME}/FETCH_GROUP_SETTINGS`
export const UPDATE_GROUP_SETTINGS = `${MODULE_NAME}/UPDATE_GROUP_SETTINGS`
export const UPDATE_GROUP_SETTINGS_PENDING = UPDATE_GROUP_SETTINGS + '_PENDING'

export function fetchGroupSettings (id) {
  return {
    type: FETCH_GROUP_SETTINGS,
    graphql: {
      query: `
        query ($id: ID) {
          group (id: $id) {
            id
            accessibility
            avatarUrl
            bannerUrl
            description
            location
            invitePath
            name
            settings {
              allowGroupInvites
              askJoinQuestions
              publicMemberDirectory
            }
            slug
            visibility
            childGroups (first: 100) {
              items {
                id
                name
                avatarUrl
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
            parentGroups (first: 100) {
              items {
                id
                name
                avatarUrl
              }
            }
            pendingInvitations {
              hasMore
              items {
                id
                email
                createdAt
                lastSentAt
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
      `,
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
          settings {
            allowGroupInvites
            askJoinQuestions
            publicMemberDirectory
          }
          joinQuestions {
            items {
              id
              questionId
              text
            }
          }
        }
      }`,
      variables: {
        id, changes
      }
    },
    meta: {
      id,
      changes,
      extractModel: 'Group',
      optimistic: true
    }
  }
}
