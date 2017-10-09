import { get } from 'lodash/fp'

export const MODULE_NAME = 'CheckInvitation'
export const CHECK_INVITATION = `${MODULE_NAME}/CHECK_INVITATION`

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

export function getValidInvite (state) {
  return get(`${MODULE_NAME}.valid`, state)
}

export const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case CHECK_INVITATION:
      return {...state, ...payload.data.checkInvitation}
  }
  return state
}
