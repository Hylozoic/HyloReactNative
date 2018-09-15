import { UNBLOCK_USER } from '../constants'

export default function unBlockUser (blockedUserId) {
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
