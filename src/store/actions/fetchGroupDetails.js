import { FETCH_GROUP_DETAILS } from 'store/constants'
import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

export default function fetchGroupDetails (id) {
  return {
    type: FETCH_GROUP_DETAILS,
    graphql: {
      query: `query ($id: ID) {
        group(id: $id) {
          ${groupFieldsFragment({ withTopics: true, withJoinQuestions: true, withPrerequisites: true })}
        }
      }`,
      variables: { id }
    },
    meta: {
      extractModel: 'Group',
      id
    }
  }
}
