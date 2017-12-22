import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'MemberProfile'
export const CLEAR_FETCH_PERSON_PENDING = `${MODULE_NAME}/CLEAR_FETCH_PERSON_PENDING`
export const FETCH_PERSON = `${MODULE_NAME}/FETCH_PERSON`

// Pending handling is a bit sensitive in the profile banner. It needs to be
// undefined (not null) unless/until we arrive at a better solution. See
// definition of `pending` in connector.
// TODO: the sort of thing that could be made into a generic action creator
export function clearFetchPersonPending () {
  return {
    type: CLEAR_FETCH_PERSON_PENDING
  }
}

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
  state => state.orm,
  (_, { id }) => id,
  (session, id) => {
    const person = session.Person.safeGet({id})
    if (!person) return null
    return {
      ...person.ref,
      skills: person.skills.toModelArray(),
      memberships: person.memberships.toModelArray()
    }
  }
)
