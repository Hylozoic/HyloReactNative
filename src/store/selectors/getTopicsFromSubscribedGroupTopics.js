import { createSelector as ormCreateSelector } from 'redux-orm'
import { flow, groupBy, map, pick, reduce, sortBy, values } from 'lodash/fp'
import orm from 'store/models'
import { topicUrl } from 'util/navigation'

const getTopicName = ({ topic: { name } }) => name.toLowerCase()

// Copied from Evo Sep-23 and modified
export const getTopicsFromSubscribedGroupTopics = (state, props) => {
  const { groupSlug, groupId } = props
  if (!groupSlug || !groupId) return []

  const groupTopics = getSubscribedGroupTopics(state, props)

  const topics = groupTopics.map(groupTopic => {
    return {
      ...groupTopic.ref,
      ...groupTopic.topic.ref,
      groupTopicId: groupTopic.id,
      url: topicUrl(groupTopic.topic.name, { groupSlug })
    }
  })
  return topics
}

// Copied from Evo Sep-23 and modified
export const getSubscribedGroupTopics = ormCreateSelector(
  orm,
  (_, { groupId }) => groupId,
  (session, groupId) => {
    let groupTopics
    if (groupId) {
      groupTopics = session.GroupTopic
        .filter({ group: groupId, visibility: 1 })
        .toModelArray()

      const pinnedGroupTopics = session.GroupTopic
        .filter({ group: groupId, isSubscribed: true, visibility: 2 })
        .toModelArray()

      return sortBy(getTopicName, pinnedGroupTopics).concat(sortBy(getTopicName, groupTopics))
    }
  }
)

// Copied from Evo Sep-23
export const mergeGroupTopics = flow([
  groupBy(getTopicName),
  values,
  map(reduce((acc, ct) => {
    if (!acc) {
      return pick(['newPostCount', 'postsTotal', 'followersTotal', 'topic'], ct)
    }

    ;['newPostCount', 'postsTotal', 'followersTotal'].forEach(attr => {
      acc[attr] += ct[attr] || 0
    })

    return acc
  }, null))
])
