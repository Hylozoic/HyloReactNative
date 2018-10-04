import { LEAVE_PROJECT } from '../constants'

export default function (id) {
  return {
    type: LEAVE_PROJECT,
    graphql: {
      query: `mutation ($id: ID) {
        leaveProject (id: $id) {
          success
        }
      }`,
      variables: {
        id
      }
    }
  }
}
