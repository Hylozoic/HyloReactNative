import {
  makeGetQueryResults, makeQueryResultsModelSelector
} from '../../store/reducers/queryResults'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from '../../store/models'
import getCurrentCommunity from '../../store/selectors/getCurrentCommunity'

export const MODULE_NAME = 'Members'

export const FETCH_MEMBERS = `${MODULE_NAME}/FETCH_MEMBERS`

export const communityMembersQuery = `
  query ($slug: String, $first: Int, $sortBy: String, $offset: Int, $search: String) {
    community (slug: $slug) {
      id
      name
      avatarUrl
      bannerUrl
      memberCount
      members (first: $first, sortBy: $sortBy, offset: $offset, search: $search) {
        items {
          id
          name
          bio
          avatarUrl
          location
          tagline
          skills {
            hasMore
            items {
              id
              name
            }
          }
        }
        hasMore
      }
    }
  }`

export const networkMembersQuery = `
  query ($slug: String, $first: Int, $sortBy: String, $offset: Int, $search: String) {
    network (slug: $slug) {
      id
      name
      slug
      avatarUrl
      bannerUrl
      memberCount
      members (first: $first, sortBy: $sortBy, offset: $offset, search: $search) {
        items {
          id
          name
          bio
          avatarUrl
          location
          tagline
          skills {
            hasMore
            items {
              id
              name
            }
          }
        }
        hasMore
      }
    }
  }`

export function fetchNetworkMembers (slug, sortBy, offset, search) {
  return {
    type: FETCH_MEMBERS,
    graphql: {
      query: networkMembersQuery,
      variables: {slug, first: 20, offset, sortBy, search}
    },
    meta: {
      extractModel: 'Network',
      extractQueryResults: {
        getItems: get('payload.data.network.members'),
        getParams: (action) => ({...get('meta.graphql.variables', action), memberSubject: 'network'})
      }
    }
  }
}

export function fetchCommunityMembers (slug, sortBy, offset, search) {
  return {
    type: FETCH_MEMBERS,
    graphql: {
      query: communityMembersQuery,
      variables: {slug, first: 20, offset, sortBy, search}
    },
    meta: {
      extractModel: 'Community',
      extractQueryResults: {
        getItems: get('payload.data.community.members'),
        getParams: (action) => ({...get('meta.graphql.variables', action), memberSubject: 'community'})
      }
    }
  }
}

export function fetchMembers ({ subject, slug, sortBy, offset, search }) {
  return subject === 'network'
    ? fetchNetworkMembers(slug, sortBy, offset, search)
    : fetchCommunityMembers(slug, sortBy, offset, search)
}

const getMemberResults = makeGetQueryResults(FETCH_MEMBERS)

export const getMembers = makeQueryResultsModelSelector(
  getMemberResults,
  'Person',
  person => ({
    ...person.ref,
    skills: person.skills && person.skills.toModelArray()
  })
)

export const getMembersOld = ormCreateSelector(
  orm,
  state => state.orm,
  getMemberResults,
  state => getCurrentCommunity(state),
  ({ Person }, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []

    return Person.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toModelArray()
      .map(person => ({
        ...person.ref,
        skills: person.skills && person.skills.toModelArray()
      }))
  }
)

export const getHasMoreMembers = createSelector(
  getMemberResults,
  get('hasMore')
)
