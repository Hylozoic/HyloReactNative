import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'ModeratorSettings'

// Constants
export const ADD_MODERATOR = `${MODULE_NAME}/ADD_MODERATOR`
export const ADD_MODERATOR_PENDING = `${ADD_MODERATOR}_PENDING`
export const REMOVE_MODERATOR = `${MODULE_NAME}/REMOVE_MODERATOR`
export const REMOVE_MODERATOR_PENDING = `${REMOVE_MODERATOR}_PENDING`
export const FETCH_MODERATOR_SUGGESTIONS = `${MODULE_NAME}/FETCH_MODERATOR_SUGGESTIONS`
export const CLEAR_MODERATOR_SUGGESTIONS = `${MODULE_NAME}/CLEAR_MODERATOR_SUGGESTIONS`
export const FETCH_MODERATORS = `${MODULE_NAME}/FETCH_MODERATORS`

const defaultState = []

export function ormSessionReducer (session, { type, meta, payload }) {
  const { Community, Person } = session
  let community, person

  switch (type) {
    case REMOVE_MODERATOR_PENDING:
      community = Community.withId(meta.communityId)
      const moderators = community.moderators.filter(m =>
        m.id !== meta.personId)
        .toModelArray()
      community.update({ moderators })
      break

    case ADD_MODERATOR_PENDING:
      person = Person.withId(meta.personId)
      Community.withId(meta.communityId).updateAppending({ moderators: [person] })
      break
  }
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_MODERATOR_SUGGESTIONS:
      return payload.data.community.members.items.map(m => m.id)
    case CLEAR_MODERATOR_SUGGESTIONS:
      return []
    default:
      return state
  }
}

export function fetchModerators (slug) {
  return {
    type: FETCH_MODERATORS,
    graphql: {
      query: `query ($slug: String) {
        community (slug: $slug) {
          id
          name
          slug
          moderators (first: 100) {
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        slug
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}

export function fetchModeratorSuggestions (id, autocomplete) {
  return {
    type: FETCH_MODERATOR_SUGGESTIONS,
    graphql: {
      query: `query ($id: ID, $autocomplete: String) {
        community (id: $id) {
          id
          members (first: 10, autocomplete: $autocomplete) {
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        id, autocomplete
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}

export function clearModeratorSuggestions () {
  return {
    type: CLEAR_MODERATOR_SUGGESTIONS
  }
}

export function addModerator (personId, communityId) {
  return {
    type: ADD_MODERATOR,
    graphql: {
      query: `mutation ($personId: ID, $communityId: ID) {
        addModerator(personId: $personId, communityId: $communityId) {
          id
          moderators (first: 100) {
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: { personId, communityId }
    },
    meta: {
      personId,
      communityId,
      optimistic: true
    }
  }
}

export function removeModerator (personId, communityId, isRemoveFromCommunity) {
  return {
    type: REMOVE_MODERATOR,
    graphql: {
      query: `mutation ($personId: ID, $communityId: ID, $isRemoveFromCommunity: Boolean) {
        removeModerator(personId: $personId, communityId: $communityId, isRemoveFromCommunity: $isRemoveFromCommunity) {
          id
          moderators (first: 100) {
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: { personId, communityId, isRemoveFromCommunity }
    },
    meta: {
      personId,
      communityId,
      isRemoveFromCommunity,
      optimistic: true
    }
  }
}

// expects props to be of the form {communityId}
export const getModerators = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.communityId,
  ({ Community }, id) => {
    const community = Community.safeGet({ id })
    if (!community) return []
    return community.moderators.toModelArray()
  }
)
