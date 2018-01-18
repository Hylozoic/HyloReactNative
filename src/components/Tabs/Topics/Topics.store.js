import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { makeGetQueryResults } from '../../../store/reducers/queryResults'
import { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'
import { includes, isEmpty } from 'lodash/fp'
export { toggleTopicSubscribe } from '../../Feed/Feed.store'

const getCommunityTopicResults = makeGetQueryResults(FETCH_COMMUNITY_TOPICS)

export const getCommunityTopics = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunityTopicResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.CommunityTopic.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

export function presentCommunityTopic (communityTopic) {
  return {
    ...communityTopic.topic.ref,
    isSubscribed: communityTopic.isSubscribed,
    newPostCount: communityTopic.newPostCount
  }
}
