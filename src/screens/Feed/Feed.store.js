import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'
import orm from 'store/models'

const MODULE_NAME = 'Feed'
export const FETCH_COMMUNITY_TOPIC = `${MODULE_NAME}/FETCH_COMMUNITY_TOPIC`
export const SET_TOPIC_SUBSCRIBE = `${MODULE_NAME}/SET_TOPIC_SUBSCRIBE`
export const SET_TOPIC_SUBSCRIBE_PENDING = SET_TOPIC_SUBSCRIBE + '_PENDING'

export function fetchCommunityTopic (topicName, communitySlug) {
  return {
    type: FETCH_COMMUNITY_TOPIC,
    graphql: {
      query: `query ($topicName: String, $communitySlug: String) {
        communityTopic(topicName: $topicName, communitySlug: $communitySlug) {
          id
          isSubscribed
          followersTotal
          postsTotal
          topic {
            id
            name
          }
          community {
            id
          }
        }
      }`,
      variables: { topicName, communitySlug }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'CommunityTopic'
    }
  }
}

export function setTopicSubscribe (topicId, communityId, isSubscribing) {
  return {
    type: SET_TOPIC_SUBSCRIBE,
    graphql: {
      query: `mutation($topicId: ID, $communityId: ID, $isSubscribing: Boolean) {
        subscribe(topicId: $topicId, communityId: $communityId, isSubscribing: $isSubscribing) {
          success
        }
      }`,
      variables: {
        topicId,
        communityId,
        isSubscribing
      }
    },
    meta: {
      optimistic: true,
      isSubscribing,
      topicId,
      communityId
    }
  }
}

export const getCommunityTopic = ormCreateSelector(
  orm,
  get('orm'),
  (state, props) => props.topicName,
  (state, props) => props.slug,
  (session, topicName, slug) => {
    const topic = session.Topic.safeGet({ name: topicName })
    const community = session.Community.safeGet({ slug })
    if (!topic || !community) return false

    return session.CommunityTopic.filter({
      topic: topic.id, community: community.id
    }).first()
  }
)
