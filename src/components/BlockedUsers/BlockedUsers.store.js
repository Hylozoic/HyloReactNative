export const MODULE_NAME = 'BlockedUsers'
export const UNBLOCK_USER = `UNBLOCK_USER`

export function unBlockUser (blockedUserId) {
  return {
    type: UNBLOCK_USER,
    graphql: {
      query: `mutation ($blockedUserId: ID) {
        unblockUser (blockedUserId: $blockedUserId) {
          success
        }
      }`,
      variables: {
        blockedUserId
      }
    }
  }
}
