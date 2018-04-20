export const MODULE_NAME = 'NotificationSettings'
export const UNLINK_ACCOUNT = `${MODULE_NAME}/UNLINK_ACCOUNT`

export function unlinkAccount (provider) {
  return {
    type: UNLINK_ACCOUNT,
    graphql: {
      query: `mutation ($provider: String) {
        unlinkAccount(provider: $provider) {
          success
        }
      }`,
      variables: {provider}
    }
  }
}
