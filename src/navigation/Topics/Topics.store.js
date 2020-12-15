import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
import { FETCH_COMMUNITY_TOPICS } from 'store/actions/fetchCommunityTopics'
export { setTopicSubscribe } from 'navigation/Feed/Feed.store'

export const MODULE_NAME = 'Topics'
export const SET_TERM = `${MODULE_NAME}/SET_TERM`

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

export const defaultState = {
  term: ''
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_TERM:
      return {
        ...state,
        term: payload
      }
    default:
      return state
  }
}

export function setTerm (term) {
  return {
    type: SET_TERM,
    payload: term
  }
}

export function getTerm (state) {
  return state[MODULE_NAME].term
}
