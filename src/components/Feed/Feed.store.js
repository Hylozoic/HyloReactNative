import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'
import orm from 'store/models'

const MODULE_NAME = 'Feed'
export const FETCH_COMMUNITY_TOPIC = `${MODULE_NAME}/FETCH_COMMUNITY_TOPIC`

export function fetchCommunityTopic (topicName, communitySlug) {
  return {
    type: FETCH_COMMUNITY_TOPIC,
    graphql: {
      query: `query ($topicName: String, $communitySlug: String) {
        communityTopic(topicName: $topicName, communitySlug: $communitySlug) {
          id
          isSubscribed
          topic {
            id
            name
          }
          community {
            id
          }
        }
      }`,
      variables: {topicName, communitySlug}
    },
    meta: {
      extractModel: 'CommunityTopic'
    }
  }
}

export const getTopicSubscriptionStatus = ormCreateSelector(
  orm,
  get('orm'),
  (state, props) => props,
  (session, { topicName, slug }) => {
    const topic = session.Topic.filter({name: topicName}).first()
    const community = session.Community.filter({slug}).first()
    if (!topic || !community) return false

    const ct = session.CommunityTopic.filter({
      topic: topic.id, community: community.id
    }).first()

    return !!get('isSubscribed', ct)
  }
)
