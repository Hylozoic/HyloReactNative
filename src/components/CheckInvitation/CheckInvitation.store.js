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
