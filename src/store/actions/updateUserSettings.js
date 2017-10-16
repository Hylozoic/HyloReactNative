export const UPDATE_USER_SETTINGS = `UPDATE_USER_SETTINGS`
export const UPDATE_USER_SETTINGS_PENDING = `${UPDATE_USER_SETTINGS}_PENDING`

export default function updateUserSettings (changes) {
  return {
    type: UPDATE_USER_SETTINGS,
    graphql: {
      query: `mutation ($changes: MeInput) {
        updateMe(changes: $changes) {
          id
        }
      }`,
      variables: {
        changes
      }
    },
    meta: {
      optimistic: true,
      changes
    }
  }
}
