import { get } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = 'JoinGroup'
export const USE_INVITATION = `${MODULE_NAME}/USE_INVITATION`
export const CHECK_INVITATION = `${MODULE_NAME}/CHECK_INVITATION`

export function useInvitation (userId, invitationCodes = {}) {
  const { invitationToken, accessCode } = invitationCodes
  return {
    type: USE_INVITATION,
    graphql: {
      query: `mutation ($userId: ID, $invitationToken: String, $accessCode: String) {
        useInvitation (userId: $userId, invitationToken: $invitationToken, accessCode: $accessCode) {
          membership {
            id
            role
            group {
              id
              name
              slug
            }
          }
          error
        }
      }`,
      variables: {
        userId,
        invitationToken,
        accessCode
      }
    },
    meta: {
      extractModel: [
        {
          modelName: 'Membership',
          getRoot: get('useInvitation.membership')
        }
      ],
      analytics: AnalyticsEvents.GROUP_INVITATION_ACCEPTED
    }
  }
}

export function checkInvitation (invitationCodes) {
  const { invitationToken, accessCode } = invitationCodes
  return {
    type: CHECK_INVITATION,
    graphql: {
      query: `query ($invitationToken: String, $accessCode: String) {
        checkInvitation (invitationToken: $invitationToken, accessCode: $accessCode) {
          valid
        }
      }`,
      variables: {
        invitationToken,
        accessCode
      }
    }
  }
}
