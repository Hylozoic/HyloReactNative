import { CREATE_COMMENT } from 'store/constants'
import { uniqueId } from 'lodash/fp'
import { divToP } from 'hylo-utils/text'
import { AnalyticsEvents } from 'hylo-utils/constants'
import createCommentMutation from 'graphql/mutations/createCommentMutation.js'

export default function createComment ({
  postId,
  parentCommentId,
  text,
  attachments
}) {
  const preprocessedText = divToP(text)

  return {
    type: CREATE_COMMENT,
    graphql: {
      query: createCommentMutation,
      variables: {
        postId,
        parentCommentId,
        text,
        attachments
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Comment',
      tempId: uniqueId(`post${postId}_`),
      postId,
      text: preprocessedText,
      attachments,
      analytics: AnalyticsEvents.COMMENT_CREATED
    }
  }
}
