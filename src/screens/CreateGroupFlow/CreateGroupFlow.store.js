import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { AnalyticsEvents } from 'hylo-utils/constants'
import { GROUP_ACCESSIBILITY, GROUP_VISIBILITY } from 'store/models/Group'
import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

export const MODULE_NAME = 'CreateGroupFlow'
export const UPDATE_GROUP_DATA = `${MODULE_NAME}/UPDATE_GROUP_DATA`
export const FETCH_URL_EXISTS = `${MODULE_NAME}/FETCH_URL_EXISTS`
export const CREATE_GROUP = `${MODULE_NAME}/CREATE_GROUP`
export const CLEAR_CREATE_GROUP_STORE = `${MODULE_NAME}/CLEAR_CREATE_GROUP_STORE`
export const FETCH_GROUP_EXISTS = `${MODULE_NAME}/FETCH_URL_EXISTS`

export const defaultState = {
  // New Group Defaults
  groupData: {
    name: '',
    slug: '',
    visibility: GROUP_VISIBILITY.Protected, 
    accessibility: GROUP_ACCESSIBILITY.Restricted,
    parentIds: []
  },
  urlExists: false,
  edited: false
}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case UPDATE_GROUP_DATA:
      return {
        ...state,
        groupData: {
          ...state.groupData,
          ...payload
        },
        edited: true
      }
    case CLEAR_CREATE_GROUP_STORE:
      return defaultState
    case FETCH_URL_EXISTS:
      return {
        ...state,
        urlExists: action.payload.data.groupExists.exists,
        edited: true
      }
  }
  return state
}

export function createGroup (groupData) {
  return {
    type: CREATE_GROUP,
    graphql: {
      query: `mutation ($data: GroupInput) {
        createGroup(data: $data) {
          id
          hasModeratorRole
          group {
            ${groupFieldsFragment({ withJoinQuestions: true })}
          }
          person {
            id
          }
        }
      }
      `,
      variables: {
        data: groupData
      }
    },
    meta: {
      extractModel: 'Membership',
      ...groupData,
      analytics: AnalyticsEvents.GROUP_CREATED
    }
  }
}

export function fetchGroupExists (slug) {
  return {
    type: FETCH_GROUP_EXISTS,
    graphql: {
      query: `
        query ($slug: String) {
          groupExists (slug: $slug) {
            exists
          }
        }
      `,
      variables: {
        slug
      }
    }
  }
}

export function updateGroupData (groupData) {
  return {
    type: UPDATE_GROUP_DATA,
    payload: groupData
  }
}

export function getGroupData (state) {
  return state[MODULE_NAME]?.groupData
}

export function getGroupUrlExists (state) {
  return state[MODULE_NAME].urlExists
}

export function getEdited (state) {
  return state[MODULE_NAME]?.edited
}

export function clearCreateGroupStore () {
  return {
    type: CLEAR_CREATE_GROUP_STORE
  }
}

export const getNewGroupParentGroups = ormCreateSelector(
  orm,
  getGroupData,
  (session, { parentIds }) => session.Group.all()
    .toRefArray()
    .filter(g => parentIds.includes(g.id))
    .sort((a, b) => a.name.localeCompare(b.name))
)
