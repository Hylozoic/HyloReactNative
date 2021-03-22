import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import {
  getSort,
  getFilter,
  setSort,
  setFilter,
  getPostIds,
  getHasMorePosts,
  defaultSortBy,
  getQueryProps
} from './FeedList.store'
import { FETCH_POSTS } from 'store/constants'
import fetchPosts from 'store/actions/fetchPosts'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'

export function mapStateToProps (state, props) {
  const { group, topicName, isProjectFeed } = props
  const sortBy = getSort(state, props)
  const filter = getFilter(state, props)
  const queryProps = getQueryProps(state, {
    group,
    sortBy,
    filter: isProjectFeed ? 'project' : filter,
    topicName
  })
  const pending = state.pending[FETCH_POSTS]
  const groupId = get('group.id', props)
  const postIds = getPostIds(state, queryProps)
  const hasMore = getHasMorePosts(state, queryProps)

  return {
    postIds,
    groupId,
    sortBy,
    filter,
    hasMore,
    pending: !!pending,
    pendingRefresh: !!(pending && pending.extractQueryResults.reset),
    queryProps // this is just here so mergeProps can use it
  }
}

const mapDispatchToProps = { setFilter, setSort, fetchPosts, resetNewPostCount }

export function shouldResetNewPostCount ({ slug, sortBy, filter, topic }) {
  return slug !== ALL_GROUP_ID
    && slug !== PUBLIC_GROUP_ID
    && !topic && sortBy === defaultSortBy
    && !filter
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { hasMore, pending, postIds, queryProps } = stateProps
  const { group } = ownProps
  const { fetchPosts } = dispatchProps
  const fetchMorePosts = hasMore && !pending
    ? () => fetchPosts({ ...queryProps, offset: postIds.length })
    : () => {}
  const fetchPostsAndResetCount = (params, opts) => {
    const promises = [fetchPosts(params, opts)]
    const groupId = get('id', group)
    if (shouldResetNewPostCount(queryProps)) {
      promises.push(dispatchProps.resetNewPostCount(groupId, 'Membership'))
    }
    return Promise.all(promises)
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPosts: () => fetchPostsAndResetCount(queryProps),
    refreshPosts: () => fetchPostsAndResetCount(queryProps, { reset: true }),
    fetchMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
