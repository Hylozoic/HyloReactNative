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
          locationObject {
            id
            addressNumber
            addressStreet
            bbox {
              lat
              lng
            }
            center {
              lat
              lng
            }
            city
            country
            fullText
            locality
            neighborhood
            region
          }
          messageThreadId
          affiliations {
            items {
              id
              role
              preposition
              orgName
              url
              createdAt
              updatedAt
              isActive
            }
          }
          memberships {
            id
            role
            hasModeratorRole
            group {
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
