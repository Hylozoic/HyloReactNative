import { JOIN_GROUP } from 'store/constants'

export function joinGroup (groupId) {
  return {
    type: JOIN_GROUP,
    graphql: {
      query: `
        mutation ($groupId: ID) {
          joinGroup(groupId: $groupId) {
            id
            role
            hasModeratorRole
            group {
              id
              name
              slug
            }
            person {
              id
            }
            settings {
              showJoinForm
            }
          }
        }
      `,
      variables: {
        groupId
      }
    },
    meta: {
      extractModel: 'Membership',
      groupId,
      optimistic: true
    }
  }
}
