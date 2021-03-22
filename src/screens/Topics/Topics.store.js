import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
import { FETCH_GROUP_TOPICS } from 'store/actions/fetchGroupTopics'
export { setTopicSubscribe } from 'screens/Feed/Feed.store'

export const MODULE_NAME = 'Topics'
export const SET_TERM = `${MODULE_NAME}/SET_TERM`

const getGroupTopicResults = makeGetQueryResults(FETCH_GROUP_TOPICS)

export const getGroupTopics = makeQueryResultsModelSelector(
  getGroupTopicResults,
  'GroupTopic')

export function presentGroupTopic (groupTopic) {
  return {
    ...groupTopic.topic.ref,
    isSubscribed: groupTopic.isSubscribed,
    newPostCount: groupTopic.newPostCount
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
