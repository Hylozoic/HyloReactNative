import { FETCH_GROUP_DETAILS } from 'store/constants'
import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

export default function fetchGroupDetails ({ id, slug }) {
  return {
    type: FETCH_GROUP_DETAILS,
    graphql: {
      query: `query ($id: ID, $slug: String) {
        group(id: $id, slug: $slug) {
          ${groupFieldsFragment({ withTopics: true, withJoinQuestions: true, withPrerequisites: true })}
        }
      }`,
      variables: { id, slug }
    },
    meta: {
      extractModel: 'Group',
      id,
      slug
    }
  }
}
