import { gql, useMutation } from 'urql'

const REACT_ON_MUTATION = gql` 
  mutation ReactOn($entityId: ID, $data: ReactionInput) {
    reactOn(entityId: $entityId, data: $data) {
      id
      myReactions {
        emojiFull
        id
      }
      postReactions {
        emojiFull
        id
        user {
          id
          name
        }
      }
    }
  }
`

const REMOVE_REACT_ON_MUTATION = gql`
  mutation RemoveReactOn($entityId: ID, $data: ReactionInput) {
    deleteReaction(entityId: $entityId, data: $data) {
      id
      myReactions {
        emojiFull
        id
      }
      postReactions {
        emojiFull
        id
        user {
          id
          name
        }
      }
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
