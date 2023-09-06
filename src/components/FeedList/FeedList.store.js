import { makeGetQueryResults } from 'store/reducers/queryResults'
import { FETCH_POSTS } from 'store/constants'
import { createSelector } from 'reselect'
import { get, isEmpty, isNull, isUndefined, omitBy } from 'lodash/fp'
import createCachedSelector from 're-reselect'

export const MODULE_NAME = 'FeedList'

export const SET_FILTER = `${MODULE_NAME}/SET_FILTER`
export const SET_SORT = `${MODULE_NAME}/SET_SORT`
export const SET_TIMEFRAME = `${MODULE_NAME}/SET_TIMEFRAME`

export const NO_POST_FILTER = 'NONE'
export const defaultSortBy = 'updated'
export const defaultTimeframe = 'future'

export const initialState = {
  filter: NO_POST_FILTER,
  sortBy: defaultSortBy,
  timeframe: defaultTimeframe
}

export default function reducer (state = initialState, action) {
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
    case SET_TIMEFRAME:
      return {
        ...state,
        timeframe: payload
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

export function setTimeframe (timeframe) {
  return {
    type: SET_TIMEFRAME,
    payload: timeframe
  }
}

export function getFilter (state) {
  return state[MODULE_NAME].filter
}

export function getSort (state) {
  return state[MODULE_NAME].sortBy
}

export function getTimeframe (state) {
  return state[MODULE_NAME].timeframe
}

const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPostIds = createSelector(
  getPostResults,
  results => isEmpty(results) ? [] : results.ids
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

// Create a cached selector since we don't want multiple onscreen feedlists to clobber the cache between each other.
export const getQueryProps = createCachedSelector(
  (_, props) => props.context,
  (_, props) => props.slug,
  (_, props) => props.sortBy,
  (_, props) => props.filter,
  (_, props) => props.topicName,
  (_, props) => props.types,
  (_, props) => props.order,
  (_, props) => props.afterTime,
  (_, props) => props.beforeTime,
  (_, props) => props.childPostInclusion,
  (
    context,
    slug,
    sortBy,
    filter,
    topicName,
    types,
    order,
    afterTime,
    beforeTime,
    childPostInclusion
  ) => {
    return omitBy(x => isNull(x) || isUndefined(x), {
      context,
      slug,
      sortBy,
      filter,
      types,
      topic: topicName,
      order,
      afterTime,
      beforeTime,
      childPostInclusion
    })
  }
)(
  (_, props) => `${get('context', props)}:${get('slug', props)}:${get('topicName', props)}`
)
