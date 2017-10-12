import { get } from 'lodash/fp'

export const MODULE_NAME = 'JoinCommunity'

export const SET_INVITATION_CODES = `${MODULE_NAME}/SET_INVITATION_CODES`
export const USE_INVITATION = `${MODULE_NAME}/USE_INVITATION`

export const defaultState = {}

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
            community {
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
      ]
    }
  }
}

export function getNewMembership (state) {
  return get(`${MODULE_NAME}.membership`, state)
}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case USE_INVITATION:
      return {...state, ...payload.data.useInvitation}
  }
  return state
}
