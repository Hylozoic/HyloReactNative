import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'NotificationSettings'
export const UPDATE_MEMBERSHIP_SETTINGS = `${MODULE_NAME}/UPDATE_MEMBERSHIP_SETTINGS`
export const UPDATE_MEMBERSHIP_SETTINGS_PENDING = `${UPDATE_MEMBERSHIP_SETTINGS}_PENDING`
export const UPDATE_ALL_MEMBERSHIP_SETTINGS = `${MODULE_NAME}/UPDATE_ALL_MEMBERSHIP_SETTINGS`
export const UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING = `${UPDATE_ALL_MEMBERSHIP_SETTINGS}_PENDING`

export function updateMembershipSettings (groupId, settings) {
  return {
    type: UPDATE_MEMBERSHIP_SETTINGS,
    graphql: {
      query: `mutation ($groupId: ID, $data: MembershipInput) {
        updateMembership(groupId: $groupId, data: $data) {
          id
        }
      }`,
      variables: {
        data: {
          settings
        },
        groupId: groupId
      }
    },
    meta: {
      groupId,
      settings,
      optimistic: true
    }
  }
}

export function updateAllMemberships (groupIds, settings) {
  const subqueries = groupIds.map(groupId => `
    alias${groupId}: updateMembership(groupId: ${groupId}, data: {settings: ${JSON.stringify(settings).replace(/"/g, '')}}) {
      id
    }
  `).join()
  const query = `mutation {
    ${subqueries}
  }`
  return {
    type: UPDATE_ALL_MEMBERSHIP_SETTINGS,
    graphql: {
      query
    },
    meta: {
      settings,
      optimistic: true
    }
  }
}

export const getMemberships = ormCreateSelector(
  orm,
  session => {
    return session?.Membership.all().toModelArray()
  }
)
