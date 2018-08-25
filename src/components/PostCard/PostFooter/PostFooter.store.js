import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = `POST_FOOTER`
export const VOTE_ON_POST = `${MODULE_NAME}_VOTE_ON_POST`
export const VOTE_ON_POST_PENDING = `${VOTE_ON_POST}_PENDING`

export function voteOnPost (postId, isUpvote) {
  return {
    type: VOTE_ON_POST,
    graphql: {
      query: `mutation($postId: ID, $isUpvote: Boolean) {
        vote(postId: $postId, isUpvote: $isUpvote) {
          id
          votesTotal
        }
      }`,
      variables: {postId, isUpvote}
    },
    meta: {
      postId,
      isUpvote,
      optimistic: true,
      analytics: AnalyticsEvents.VOTED_ON_POST
    }
  }
}
