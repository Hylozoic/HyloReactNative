import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from '../../store/models'

export const MODULE_NAME = 'NotificationSettings'
export const UPDATE_MEMBERSHIP_SETTINGS = `${MODULE_NAME}/UPDATE_MEMBERSHIP_SETTINGS`
export const UPDATE_MEMBERSHIP_SETTINGS_PENDING = `${UPDATE_MEMBERSHIP_SETTINGS}_PENDING`

export function updateMembershipSettings (communityId, settings) {
  return {
    type: UPDATE_MEMBERSHIP_SETTINGS,
    graphql: {
      query: `mutation ($communityId: ID, $data: MembershipInput) {
        updateMembership(communityId: $communityId, data: $data) {
          id
        }
      }`,
      variables: {
        data: {
          settings
        },
        communityId: communityId
      }
    },
    meta: {
      communityId,
      settings,
      optimistic: true
    }
  }
}

export const getMemberships = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
    return session.Membership.all().toModelArray()
  }
)
