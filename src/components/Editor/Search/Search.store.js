import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'Search'
export const FIND_MENTIONS = `${MODULE_NAME}/FIND_MENTIONS`
export const FIND_MENTIONS_PENDING = `${MODULE_NAME}/FIND_MENTIONS_PENDING`
export const FIND_TOPICS = `${MODULE_NAME}/FIND_TOPICS`
export const FIND_TOPICS_PENDING = `${MODULE_NAME}/FIND_TOPICS_PENDING`
export const SearchType = {
  MENTION: 'mention',
  TOPIC: 'topic'
}

export default function reducer (state = {}, action) {
  const { type, meta } = action
  switch (type) {
    case FIND_MENTIONS_PENDING:
      return {
        ...state,
        mentionSearchTerm: meta.graphql.variables.term
      }
    case FIND_TOPICS_PENDING:
      return {
        ...state,
        topicSearchTerm: meta.graphql.variables.term
      }
  }
  return state
}

export function findMentions (term) {
  return {
    type: FIND_MENTIONS,
    graphql: {
      query: `query ($term: String) {
        people(autocomplete: $term, first: 20) {
          items {
            id
            name
            avatarUrl
          }
        }
      }`,
      variables: {term}
    },
    meta: {extractModel: 'Person'}
  }
}

// TODO make this work for all communities & multiple specific communities
export function findTopics (term, communityId) {
  const collectTopics = results =>
    results.community.communityTopics.items.map(item => item.topic)
  return {
    type: FIND_TOPICS,
    graphql: {
      query: `query ($term: String, $communityId: ID) {
        community(id: $communityId) {
          communityTopics(autocomplete: $term, first: 20) {
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
        term,
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

const moduleSelector = state => state[MODULE_NAME]

export const getMentions = ormCreateSelector(
  orm,
  state => state.orm,
  moduleSelector,
  (session, substate) => {
    const { mentionSearchTerm } = substate
    if (!mentionSearchTerm) return []

    const term = mentionSearchTerm.toLowerCase()
    return session.Person.all()
    .filter(({ name }) => name && name.toLowerCase().match(term))
    .toRefArray()
  }
)

// FIXME this could return topics that are not in the current community
export const getTopics = ormCreateSelector(
  orm,
  state => state.orm,
  moduleSelector,
  (session, substate) => {
    const { topicSearchTerm } = substate
    if (!topicSearchTerm) return []

    const term = topicSearchTerm.toLowerCase()
    const topics = session.Topic.all()
      .filter(({ name }) => name && name.toLowerCase().match(term))
      .orderBy('name')
      .toRefArray()
    const isNewTopic = !!topics.find(t => t.name !== topicSearchTerm)

    return isNewTopic
      ? [ { id: 'newtopic', name: topicSearchTerm }, ...topics ]
      : topics
  }
)

export function getResults (state, props) {
  switch (props.type) {
    case SearchType.MENTION:
      return getMentions(state, props)
    case SearchType.TOPIC:
      return getTopics(state, props)
  }
}
