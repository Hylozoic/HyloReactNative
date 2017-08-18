import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'MemberProfile'
export const FETCH_PERSON = `${MODULE_NAME}/FETCH_PERSON`

export function fetchPerson (id) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query: `query PersonDetails ($id: ID) {
        person (id: $id) {
          id
          name
          avatarUrl
          bannerUrl
          bio
          twitterName
          linkedinUrl
          facebookUrl
          url
          tagline
          location
          messageThreadId
          memberships {
            id
            role
            hasModeratorRole
            community {
              id
              name
              slug
            }
          }
          skills (first: 100) {
            total
            hasMore
            items {
              id
              name
            }
          }
        }
      }`,
      variables: { id }
    },
    meta: { extractModel: 'Person' }
  }
}

export const getPerson = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { id }) => id,
  (session, id) => session.Person.safeGet({id})
)
