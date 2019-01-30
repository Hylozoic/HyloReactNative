import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import { makeGetQueryResults } from '../../store/reducers/queryResults'
import { FETCH_POSTS } from '../../store/actions/fetchPosts'
import { createSelector } from 'reselect'
import { get, isEmpty, isNull, isUndefined, omitBy } from 'lodash/fp'
import createCachedSelector from 're-reselect'

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

export const getPostIds = createSelector(
  getPostResults,
  results => isEmpty(results) ? [] : results.ids
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

// Create a cached selector since we don't want multiple onscreen feedlists to clobber the cache between each other.
export const getQueryProps = createCachedSelector(
  (_, props) => props.community,
  (_, props) => props.network,
  (_, props) => props.sortBy,
  (_, props) => props.filter,
  (_, props) => props.topicName,
  (community, network, sortBy, filter, topicName, isProjectFeed) => {
    var subject

    console.log('getQueryProps, isProjectFeed', isProjectFeed)

    if (isProjectFeed) {
      subject = 'project'
    } else if (community) {
      subject = 'community'
    } else if (network) {
      subject = 'network'
    } else {
      subject = 'all-communities'
    }

    return omitBy(x => isNull(x) || isUndefined(x), {
      sortBy,
      filter,
      subject,
      slug: get('slug', community) || (!network && ALL_COMMUNITIES_ID),
      networkSlug: get('slug', network),
      topic: topicName
    })
  }
)(
  (state, props) => `${get('community.id', props)}:${get('network.id', props)}:${get('topicName', props)}`
)
