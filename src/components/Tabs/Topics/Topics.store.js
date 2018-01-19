import { makeGetQueryResults, makeQueryResultsModelSelector } from '../../../store/reducers/queryResults'
import { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'
export { toggleTopicSubscribe } from '../../Feed/Feed.store'

const getCommunityTopicResults = makeGetQueryResults(FETCH_COMMUNITY_TOPICS)

export const getCommunityTopics = makeQueryResultsModelSelector(
  getCommunityTopicResults,
  'CommunityTopic')

export function presentCommunityTopic (communityTopic) {
  return {
    ...communityTopic.topic.ref,
    isSubscribed: communityTopic.isSubscribed,
    newPostCount: communityTopic.newPostCount
  }
}
