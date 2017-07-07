import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get } from 'lodash/fp'

export const MODULE_NAME = 'Search'
export const FIND_MENTIONS = `${MODULE_NAME}/FIND_MENTIONS`
export const FIND_MENTIONS_PENDING = `${MODULE_NAME}/FIND_MENTIONS_PENDING`
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

const moduleSelector = state => state[MODULE_NAME]

export const getMentions = ormCreateSelector(
  orm,
  state => state.orm,
  moduleSelector,
  (session, moduleNode) => {
    const { mentionSearchTerm } = moduleNode
    if (!mentionSearchTerm) return []

    return session.Person.all()
    .filter(({ name }) => name &&
      name.toLowerCase().match(mentionSearchTerm.toLowerCase()))
    .toRefArray()
  }
)

export function getSearchTerm (state, props) {
  const type = get('state.params.type', props.navigation)
  switch (type) {
    case SearchType.MENTION:
      return moduleSelector(state).mentionSearchTerm
    case SearchType.TOPIC:
      return moduleSelector(state).topicSearchTerm
  }
}

export function getResults (state, props) {
  const type = get('state.params.type', props.navigation)
  switch (type) {
    case SearchType.MENTION:
      return getMentions(state, props)
  }
}

import faker from 'faker'
import { times } from 'lodash/fp'

function fakeResults (count) {
  return times(() => ({
    id: faker.random.number(),
    name: faker.name.findName(),
    avatarUrl: faker.image.avatar()
  }), count)
}
