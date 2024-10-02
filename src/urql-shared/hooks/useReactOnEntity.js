import { gql, useMutation } from 'urql'

const REACT_ON_MUTATION = gql` 
  mutation reactOn($entityId: ID, $data: ReactionInput) {
    reactOn(entityId: $entityId, data: $data) {
      id
    }
  }
`

const REMOVE_REACT_ON_MUTATION = gql`
  mutation removeReactOn($entityId: ID, $data: ReactionInput) {
    deleteReaction(entityId: $entityId, data: $data) {
      id
    }
  }
`

export default function useReactOnEntity () {
  const [reactOnResult, reactOn] = useMutation(REACT_ON_MUTATION)
  const [removeReactOnResult, removeReactOn] = useMutation(REMOVE_REACT_ON_MUTATION)

  const reactOnEntity = async (entityType, entityId, emojiFull) =>
    reactOn({ entityId, data: { emojiFull, entityType, entityId } })

  const removeReactOnFromEntity = async (entityType, entityId, emojiFull) =>
    removeReactOn({ entityId, data: { emojiFull, entityType, entityId } })

  return { reactOnEntity, removeReactOnFromEntity }
}

// TODO: Re-integrate analytics reporting:
// analytics: {
//   commentId,
//   eventName: entityType === 'post' ? AnalyticsEvents.POST_REACTION : AnalyticsEvents.COMMENT_REACTION,
//   emoji: emojiFull,
//   groupId: groupIds,
//   postId,
//   type: entityType === 'post' ? 'post' : 'comment'
// }
