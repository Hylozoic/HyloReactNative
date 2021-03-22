import { FETCH_TOPICS_FOR_GROUP_ID } from '../constants'

// TODO make this work for all groups & multiple specific groups
export default function fetchTopicsForGroupId (groupId) {
  return function (searchTerm) {
    const collectTopics = results =>
      results.group.groupTopics.items.map(item => item.topic)

    return {
      type: FETCH_TOPICS_FOR_GROUP_ID,
      graphql: {
        query: `query ($searchTerm: String, $groupId: ID) {
          group(id: $groupId) {
            groupTopics(autocomplete: $searchTerm, first: 20) {
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
          groupId
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
