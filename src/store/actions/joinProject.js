import { JOIN_PROJECT } from '../constants'

export default function (id) {
  return {
    type: JOIN_PROJECT,
    graphql: {
      query: `mutation ($id: ID) {
        joinProject (id: $id) {
          success
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      id
    }
  }
}
