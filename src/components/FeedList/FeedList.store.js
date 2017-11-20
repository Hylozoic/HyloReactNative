import { makeGetQueryResults, makeQueryResultsModelSelector } from '../../store/reducers/queryResults'
import { FETCH_POSTS } from '../../store/actions/fetchPosts'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'

export const MODULE_NAME = 'FeedList'

export const SET_FILTER = `${MODULE_NAME}/SET_FILTER`
export const SET_SORT = `${MODULE_NAME}/SET_SORT`

export const defaultFilter = null
export const defaultSortBy = 'updated'

export const defaultState = {
  filter: defaultFilter,
  sortBy: defaultSortBy
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_FILTER:
      return {
        ...state,
        filter: payload
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

export function setFilter (filter) {
  return {
    type: SET_FILTER,
    payload: filter
  }
}

export function setSort (sortBy) {
  return {
    type: SET_SORT,
    payload: sortBy
  }
}

export function getFilter (state) {
  return state[MODULE_NAME].filter
}

export function getSort (state) {
  return state[MODULE_NAME].sortBy
}

const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPosts = makeQueryResultsModelSelector(
  getPostResults,
  'Post'
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))
