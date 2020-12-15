import {
  makeGetQueryResults, makeQueryResultsModelSelector
} from 'store/reducers/queryResults'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from 'store/models'
import getCurrentCommunity from 'store/selectors/getCurrentCommunity'

export const MODULE_NAME = 'Members'

export const FETCH_MEMBERS = `${MODULE_NAME}/FETCH_MEMBERS`
export const SET_SORT = `${MODULE_NAME}/SET_SORT`
export const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`

export const defaultState = {
  search: '',
  sortBy: 'join'
}

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
      variables: { slug, first: 20, offset, sortBy, search }
    },
    meta: {
      extractModel: 'Network',
      extractQueryResults: {
        getItems: get('payload.data.network.members'),
        getParams: (action) => ({ ...get('meta.graphql.variables', action), memberSubject: 'network' })
      }
    }
  }
}

export function fetchCommunityMembers (slug, sortBy, offset, search) {
  return {
    type: FETCH_MEMBERS,
    graphql: {
      query: communityMembersQuery,
      variables: { slug, first: 20, offset, sortBy, search }
    },
    meta: {
      extractModel: 'Community',
      extractQueryResults: {
        getItems: get('payload.data.community.members'),
        getParams: (action) => ({ ...get('meta.graphql.variables', action), memberSubject: 'community' })
      }
    }
  }
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_SEARCH:
      return {
        ...state,
        search: payload
      }
    case SET_SORT:
      return {
        ...state,
        sortBy: payload
      }
    default:
      return state
  }
}

export function getSearch (state) {
  return state[MODULE_NAME].search
}

export function setSearch (search) {
  return {
    type: SET_SEARCH,
    payload: search
  }
}

export function getSort (state) {
  return state[MODULE_NAME].sortBy
}

export function setSort (sortBy) {
  return {
    type: SET_SORT,
    payload: sortBy
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
