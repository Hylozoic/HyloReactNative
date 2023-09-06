import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import {
  getSort,
  getFilter,
  getTimeframe,
  setSort,
  setFilter,
  setTimeframe,
  getPostIds,
  getHasMorePosts,
  defaultSortBy,
  getQueryProps,
  NO_POST_FILTER
} from './FeedList.store'
import { FETCH_POSTS } from 'store/constants'
import { ALL_GROUP_ID, isContextGroup, PUBLIC_GROUP_ID } from 'store/models/Group'
import getMe from 'store/selectors/getMe'
import fetchPosts from 'store/actions/fetchPosts'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import updateUserSettings from 'store/actions/updateUserSettings'

export function mapStateToProps (state, props) {
  const { forGroup, topicName, customView } = props
  const currentUser = getMe(state, props)

  const defaultPostType = get('settings.streamPostType', currentUser) || null
  const defaultSortBy = get('settings.streamSortBy', currentUser) || 'updated'
  const childPostInclusion = get('settings.streamChildPosts', currentUser) || 'yes'

  const postTypeFilter = props?.feedType || getFilter(state, props) || defaultPostType
  const customViewSort = customView?.defaultSort

  let sortBy = customViewSort || getSort(state, props) || defaultSortBy
  // Only custom views can be sorted by manual order
  if (!customView && sortBy === 'order') {
    sortBy = 'updated'
  }
  const timeframe = getTimeframe(state, props)
  const activePostsOnly = customView?.activePostsOnly
  // TODO: The below logic tied to customView.type could
  // be removed and handled by ignoring empty arrays for
  // these two keys.
  const customViewType = customView?.type
  const customPostTypes = customViewType === 'stream' ? customView?.postTypes : null
  const customViewTopics = customViewType === 'stream' ? customView?.topics : null

  const customViewCollectionId = customView?.collectionId

  let fetchPostParam = getQueryProps(state, {
    activePostsOnly,
    childPostInclusion,
    forCollection: customViewCollectionId,
    // Can be one of: ['groups', 'all', 'public']
    context: isContextGroup(forGroup?.slug)
      ? forGroup.slug
      : 'groups',
    slug: forGroup?.slug,
    topicName,
    sortBy,
    topics: customViewTopics?.toModelArray().map(t => t.id) || [],
    types: customPostTypes,
    // Can be any of the Post Types:
    filter: postTypeFilter === NO_POST_FILTER ? null : postTypeFilter
  })

  if (props.feedType === 'event') {
    fetchPostParam = {
      ...fetchPostParam,
      order: timeframe === 'future' ? 'asc' : 'desc',
      afterTime: timeframe === 'future' ? new Date().toISOString() : null,
      beforeTime: timeframe === 'past' ? new Date().toISOString() : null
    }
  }

  const pending = state.pending[FETCH_POSTS]
  const postIds = getPostIds(state, fetchPostParam)
  const hasMore = getHasMorePosts(state, fetchPostParam)

  return {
    postIds,
    sortBy,
    filter: postTypeFilter,
    timeframe,
    hasMore,
    pending: !!pending,
    pendingRefresh: !!(pending && pending.extractQueryResults.reset),
    fetchPostParam
  }
}

const mapDispatchToProps = { setFilter, setSort, setTimeframe, fetchPosts, resetNewPostCount, updateUserSettings }

export function shouldResetNewPostCount ({ slug, sortBy, filter, topic }) {
  return slug !== ALL_GROUP_ID &&
    slug !== PUBLIC_GROUP_ID &&
    !topic &&
    sortBy === defaultSortBy &&
    !filter
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { hasMore, pending, postIds, fetchPostParam } = stateProps
  const { forGroup } = ownProps
  const { fetchPosts } = dispatchProps
  const fetchMorePosts = hasMore && !pending
    ? () => fetchPosts({ ...fetchPostParam, offset: postIds.length })
    : () => {}
  const fetchPostsAndResetCount = (params, opts) => {
    const promises = [fetchPosts(params, opts)]
    const forGroupId = get('id', forGroup)
    if (shouldResetNewPostCount(fetchPostParam)) {
      promises.push(dispatchProps.resetNewPostCount(forGroupId, 'Membership'))
    }
    return Promise.all(promises)
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPosts: () => fetchPostsAndResetCount(fetchPostParam),
    refreshPosts: () => fetchPostsAndResetCount(fetchPostParam, { reset: true }),
    fetchMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
