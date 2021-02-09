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
  const { Group, Person } = session
  let group, person

  switch (type) {
    case REMOVE_MODERATOR_PENDING:
      group = Group.withId(meta.groupId)
      const moderators = group.moderators.filter(m =>
        m.id !== meta.personId)
        .toModelArray()
      group.update({ moderators })
      break

    case ADD_MODERATOR_PENDING:
      person = Person.withId(meta.personId)
      Group.withId(meta.groupId).updateAppending({ moderators: [person] })
      break
  }
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_MODERATOR_SUGGESTIONS:
      return payload.data.group.members.items.map(m => m.id)
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
        group (slug: $slug) {
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
      extractModel: 'Group'
    }
  }
}

export function fetchModeratorSuggestions (id, autocomplete) {
  return {
    type: FETCH_MODERATOR_SUGGESTIONS,
    graphql: {
      query: `query ($id: ID, $autocomplete: String) {
        group (id: $id) {
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
      extractModel: 'Group'
    }
  }
}

export function clearModeratorSuggestions () {
  return {
    type: CLEAR_MODERATOR_SUGGESTIONS
  }
}

export function addModerator (personId, groupId) {
  return {
    type: ADD_MODERATOR,
    graphql: {
      query: `mutation ($personId: ID, $groupId: ID) {
        addModerator(personId: $personId, groupId: $groupId) {
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
      variables: { personId, groupId }
    },
    meta: {
      personId,
      groupId,
      optimistic: true
    }
  }
}

export function removeModerator (personId, groupId, isRemoveFromGroup) {
  return {
    type: REMOVE_MODERATOR,
    graphql: {
      query: `mutation ($personId: ID, $groupId: ID, $isRemoveFromGroup: Boolean) {
        removeModerator(personId: $personId, groupId: $groupId, isRemoveFromGroup: $isRemoveFromGroup) {
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
      variables: { personId, groupId, isRemoveFromGroup }
    },
    meta: {
      personId,
      groupId,
      isRemoveFromGroup,
      optimistic: true
    }
  }
}

// expects props to be of the form {groupId}
export const getModerators = ormCreateSelector(
  orm,
  (state, props) => props.groupId,
  ({ Group }, id) => {
    const group = Group.safeGet({ id })
    if (!group) return []
    return group.moderators.toModelArray()
  }
)
