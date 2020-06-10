import { FETCH_TOPICS_FOR_COMMUNITY_ID } from '../constants'

// TODO make this work for all communities & multiple specific communities
export default function fetchTopicsForCommunityId (communityId) {
  return function (searchTerm) {
    const collectTopics = results =>
      results.community.communityTopics.items.map(item => item.topic)

    return {
      type: FETCH_TOPICS_FOR_COMMUNITY_ID,
      graphql: {
        query: `query ($searchTerm: String, $communityId: ID) {
          community(id: $communityId) {
            communityTopics(autocomplete: $searchTerm, first: 20) {
              items {
                topic {
                  id
                  followersTotal
                  name
                  postsTotal
                }
              }
            }
          }
        }`,
        variables: {
          searchTerm,
          communityId
        }
      },
      meta: {
        extractModel: {
          getRoot: collectTopics,
          modelName: 'Topic',
          append: true
        }
      }
    }
  }
}