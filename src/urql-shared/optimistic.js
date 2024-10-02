import { gql } from 'urql'
import postQuery from 'graphql/queries/postQuery'

export default {
  Mutation: {
    reactOn: (result, args, cache) => {
      console.log('reactOn', result, args, cache)
      // const { entityId, data: { entityType, emojiFull } } = args
      // const newReaction = { emojiFull }

      // // const entityFields = cache.inspectFields(`${entityType}:${entityId}`)
      // // console.log('!!!!!!!! entityFields:', `${entityType}:${entityId}`, entityFields)

      // // const cacheKeys = cache.inspectFields('Query')
      // // console.log(cacheKeys)

      // if (entityType === 'Post') {
      //   // const postData = cache.readFragment(
      //   //   gql`
      //   //     fragment _ on Post {
      //   //       postReactionsTotal
      //   //       myReactions
      //   //       postReactions
      //   //     }
      //   //   `,
      //   //   { id: entityId }
      //   // )
      //   const data = cache.readQuery({
      //     query: postQuery,
      //     variables: { id: entityId }
      //   })
      //   const postData = data?.post
      //   console.log('postData', postData)

      //   if (postData) {
      //     cache.writeFragment(
      //       gql`
      //         fragment _ on Post {
      //           postReactionsTotal
      //           myReactions
      //           postReactions
      //         }
      //       `,
      //       {
      //         id: entityId,
      //         postReactionsTotal: (postData.postReactionsTotal || 0) + 1,
      //         myReactions: [...(postData.myReactions || []), newReaction],
      //         postReactions: [...(postData.postReactions || []), newReaction]
      //       }
      //     )
      //   }
      // } else if (entityType === 'Comment') {
      //   const commentData = cache.readFragment(
      //     gql`
      //       fragment _ on Comment {
      //         id
      //         commentReactionsTotal
      //         myReactions
      //         commentReactions
      //       }
      //     `,
      //     { id: entityId }
      //   )

      //   if (commentData) {
      //     cache.writeFragment(
      //       gql`
      //         fragment _ on Comment {
      //           id
      //           commentReactionsTotal
      //           myReactions
      //           commentReactions
      //         }
      //       `,
      //       {
      //         id: entityId,
      //         commentReactionsTotal: (commentData.commentReactionsTotal || 0) + 1,
      //         myReactions: [...(commentData.myReactions || []), newReaction],
      //         commentReactions: [...(commentData.commentReactions || []), newReaction]
      //       }
      //     )
      //   }
      // }
    }
  }
}
