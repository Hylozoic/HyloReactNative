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
              memberCount
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
    meta: {
      afterInteractions: true,
      extractModel: 'Person'
    }
  }
}

export const getPerson = ormCreateSelector(
  orm,
  (_, { id }) => id,
  (session, id) => {
    const person = session.Person.safeGet({ id })
    if (!person) return null
    return {
      ...person.ref,
      skills: person.skills.toRefArray(),
      memberships: person.memberships.toModelArray()
    }
  }
)
