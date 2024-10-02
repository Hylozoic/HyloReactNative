import { gql } from 'urql'
import postQuery from 'graphql/queries/postQuery'

export default {
  reactOn: (parent, args, cache, info) => {
    const { entityType, entityId, emojiFull } = args.data
    console.log('!!!! reactOn -- args:', args.data)

    const newReaction = {
      __typename: 'Reaction',
      id: Math.random().toString(),  // Temporary unique ID for optimistic updates
      emojiFull
    }

    if (entityType === 'post') {
      const data = cache.readQuery({
        query: postQuery,
        variables: { id: entityId }
      })
      const postData = data?.post
      console.log('postData', postData)

      // TODO: write fragment isn't doing anything ?
      if (postData) {
        const result = cache.writeFragment(
          gql`
            fragment _ on Post {
              id
              postReactionsTotal
              myReactions
              postReactions
            }
          `,
          {
            id: entityId,
            postReactionsTotal: (postData.postReactionsTotal || 0) + 1,
            myReactions: [...(postData.myReactions || []), newReaction],
            postReactions: [...(postData.postReactions || []), newReaction]
          }
        )
        console.log('result', result)
      }
    } else if (entityType === 'comment') {
      const commentData = cache.readFragment(
        gql`
          fragment _ on Comment {
            id
            commentReactionsTotal
            myReactions
            commentReactions
          }
        `,
        { id: entityId }
      )

      if (commentData) {
        cache.writeFragment(
          gql`
            fragment _ on Comment {
              id
              commentReactionsTotal
              myReactions
              commentReactions
            }
          `,
          {
            id: entityId,
            commentReactionsTotal: (commentData.commentReactionsTotal || 0) + 1,
            myReactions: [...(commentData.myReactions || []), newReaction],
            commentReactions: [...(commentData.commentReactions || []), newReaction]
          }
        )
      }
    }
  }
}


// console.log('!!!! reactOn -- args:', args.data);
// const { emojiFull, entityId } = args.data;

// // Create a new reaction entity with a unique temporary identifier
// const newReaction = {
//   __typename: 'Reaction',
//   id: Math.random().toString(),  // Temporary unique ID for optimistic updates
//   emojiFull
// };

// // Resolve the Post entity from the cache
// const postKey = cache.keyOfEntity({ __typename: 'Post', id: entityId });

// if (!postKey) {
//   console.log('Post not found in cache');
//   return null;  // Handle case where the post is not yet in the cache
// }

// // Resolve the existing postReactions field (which should be an array of links to Reaction objects)
// const postReactions = cache.resolve(postKey, 'postReactions') || [];

// // Create a cache key for the new reaction
// const newReactionKey = cache.keyOfEntity(newReaction);

// // Add the new reaction's link to the postReactions array
// const updatedReactions = [...postReactions, newReactionKey];  // Append the new reaction link

// // Link the new reaction in the cache
// cache.link(newReactionKey, 'emojiFull', newReaction.emojiFull);

// // Link the updated postReactions array back to the Post entity
// cache.link(postKey, 'postReactions', updatedReactions);

// console.log('Updated postReactions with links:', updatedReactions);

// // Return the updated Post object for optimistic updates
// return {
//   __typename: 'Post',
//   id: entityId,
//   postReactions: updatedReactions
// }






















// // console.log('!!!! reactOn -- args:', args.data)
// // // {"emojiFull": "🧇", "entityId": "58236", "entityType": "post"}
// // const { emojiFull, entityId, entityType } = args.data
// // // const newReaction = { emojiFull }
// // // const post = cache.resolve(cache.keyOfEntity({ __typename: 'Post', id: entityId }))

// // //   { id: entityId.toString() }
// // // )
// // const postLink = cache.resolve({ __typename: 'Query' }, cache.keyOfField('post', { id: entityId }))
// // const postReactions = cache.resolve(postLink, 'postReactions')
// // console.log('!!! postReactions', postReactions)













// // console.log('!!! post', post)

// // console.log('postData', entityId, postData)
// // console.log('!!!! reactOn -- cache:', cache)
// // console.log('!!!! reactOn -- info:', info)
// // const { entityId, data: { entityType, emojiFull } } = args
// // const newReaction = { emojiFull }

// // // const entityFields = cache.inspectFields(`${entityType}:${entityId}`)
// // // console.log('!!!!!!!! entityFields:', `${entityType}:${entityId}`, entityFields)

// // // const cacheKeys = cache.inspectFields('Query')
// // // console.log(cacheKeys)
