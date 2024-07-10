import { makeGetQueryResults } from 'store/reducers/queryResults'
import { FETCH_POSTS } from 'store/constants'
import { createSelector } from 'reselect'
import { get, isEmpty, isNull, isUndefined, omitBy, reject } from 'lodash/fp'
import createCachedSelector from 're-reselect'

export const MODULE_NAME = 'FeedList'

export const SET_FILTER = `${MODULE_NAME}/SET_FILTER`
export const SET_SORT = `${MODULE_NAME}/SET_SORT`
export const SET_TIMEFRAME = `${MODULE_NAME}/SET_TIMEFRAME`

export const NO_POST_FILTER = 'NONE'
export const defaultSortBy = 'updated'
export const defaultTimeframe = 'future'

const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPostIds = createSelector(
  getPostResults,
  results => isEmpty(results) ? [] : results.ids
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

// TODO: This is likely no longer necessary as we probably don't
// have multiple feeds onscreen at the same time. Confirm and remove:
//
// Create a cached selector since we don't want multiple onscreen FeedLists
// to clobber the cache between each other.
export const getQueryProps = createCachedSelector(
  (_, props) => props.activePostsOnly,
  (_, props) => props.announcementOnly,
  (_, props) => props.context,
  (_, props) => props.createdBy,
  (_, props) => props.forCollection,
  (_, props) => props.mentionsOf,
  (_, props) => props.myHome,
  (_, props) => props.interactedWithBy,
  (_, props) => props.slug,
  (_, props) => props.sortBy,
  (_, props) => props.filter,
  (_, props) => props.topicName,
  (_, props) => props.topics,
  (_, props) => props.types,
  (_, props) => props.order,
  (_, props) => props.afterTime,
  (_, props) => props.beforeTime,
  (_, props) => props.childPostInclusion,
  (
    activePostsOnly,
    announcementOnly,
    context,
    createdBy,
    forCollection,
    mentionsOf,
    myHome,
    interactedWithBy,
    slug,
    sortBy,
    filter,
    topicName,
    topics,
    types,
    order,
    afterTime,
    beforeTime,
    childPostInclusion
  ) => {
    return omitBy(x => isNull(x) || isUndefined(x), {
      activePostsOnly,
      announcementOnly,
      context,
      createdBy,
      forCollection,
      mentionsOf,
      myHome,
      interactedWithBy,
      slug,
      sortBy,
      filter,
      topics,
      types,
      topic: topicName,
      order,
      afterTime,
      beforeTime,
      childPostInclusion
    })
  }
)(
  (_, props) => {
    const keyArray = reject(x => isNull(x) || isUndefined(x) || isEmpty(x), [
      get('context', props),
      get('slug', props),
      get('topicName', props),
      get('myHome', props),
      get('forCollection', props),
      (get('topics', props) || []).join('.'),
      (get('types', props) || []).join('.')
    ])

    return keyArray.join(':')
  }
)
