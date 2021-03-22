export const RESET_NEW_POST_COUNT = 'RESET_NEW_POST_COUNT'
export const RESET_NEW_POST_COUNT_PENDING = 'RESET_NEW_POST_COUNT_PENDING'

export default function resetNewPostCount (id, type) {
  if (!['GroupTopic', 'Membership'].includes(type)) {
    throw new Error(`bad type for resetNewPostCount: ${type}`)
  }

  return {
    type: RESET_NEW_POST_COUNT,
    graphql: {
      query: type === 'GroupTopic' ? GroupTopicQuery : MembershipQuery,
      variables: {
        id,
        data: {
          newPostCount: 0
        }
      }
    },
    meta: { id, type, optimistic: true }
  }
}

const GroupTopicQuery = `mutation($id: ID, $data: GroupTopicInput) {
    updateGroupTopic(id: $id, data: $data) {
      success
    }
  }`

const MembershipQuery = `mutation($id: ID, $data: MembershipInput) {
    updateMembership(groupId: $id, data: $data) {
      id
    }
  }`
