import { createSelector as ormCreateSelector } from 'redux-orm'
import gql from 'graphql-tag'
import orm from 'store/models'

const MODULE_NAME = 'Feed'
export const FETCH_GROUP_TOPIC = `${MODULE_NAME}/FETCH_GROUP_TOPIC`
export const SET_TOPIC_SUBSCRIBE = `${MODULE_NAME}/SET_TOPIC_SUBSCRIBE`
export const SET_TOPIC_SUBSCRIBE_PENDING = SET_TOPIC_SUBSCRIBE + '_PENDING'

export function fetchGroupTopic (topicName, groupSlug) {
  return {
    type: FETCH_GROUP_TOPIC,
    graphql: {
      query: gql`
        query GroupTopicQuery($topicName: String, $groupSlug: String) {
          groupTopic(topicName: $topicName, groupSlug: $groupSlug) {
            id
            isSubscribed
            followersTotal
            postsTotal
            topic {
              id
              name
            }
            group {
              id
            }
          }
        }
      `,
      variables: { topicName, groupSlug }
    },
    meta: {
      afterInteractions: true,
      extractModel: 'GroupTopic'
    }
  }
}

export function setTopicSubscribe (topicId, groupId, isSubscribing) {
  return {
    type: SET_TOPIC_SUBSCRIBE,
    graphql: {
      query: gql`
        mutation TopicSubscribeMutation($topicId: ID, $groupId: ID, $isSubscribing: Boolean) {
          subscribe(topicId: $topicId, groupId: $groupId, isSubscribing: $isSubscribing) {
            success
          }
        }
      `,
      variables: {
        topicId,
        groupId,
        isSubscribing
      }
    },
    meta: {
      optimistic: true,
      isSubscribing,
      topicId,
      groupId
    }
  }
}

export const getGroupTopic = ormCreateSelector(
  orm,
  (state, props) => props.topicName,
  (state, props) => props.slug,
  (session, topicName, slug) => {
    const topic = session.Topic.safeGet({ name: topicName })
    const group = session?.Group.safeGet({ slug })
    if (!topic || !group) return false

    return session.GroupTopic.filter({
      topic: topic.id, group: group.id
    }).first()
  }
)
