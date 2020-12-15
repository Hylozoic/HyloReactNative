import { connect } from 'react-redux'
import { get } from 'lodash/fp'

import {
  getSort,
  getFilter,
  setSort,
  setFilter,
  getPostIds,
  getHasMorePosts,
  getProjectIds,
  getHasMoreProjects,
  defaultSortBy,
  getQueryProps
} from './FeedList.store'
import fetchPosts, { FETCH_POSTS } from 'store/actions/fetchPosts'
import fetchProjects, { FETCH_PROJECTS } from 'store/actions/fetchProjects'

import resetNewPostCount from 'store/actions/resetNewPostCount'

export function mapStateToProps (state, props) {
  const sortBy = getSort(state, props)
  const filter = getFilter(state, props)
  const { community, network, topicName, isProjectFeed } = props

  const queryProps = getQueryProps(state, {
    community: community,
    network,
    sortBy,
    filter: isProjectFeed ? 'project' : filter,
    topicName,
    isProjectFeed
  })
  const pending = isProjectFeed ? state.pending[FETCH_PROJECTS] : state.pending[FETCH_POSTS]
  const communityId = get('community.id', props)

  const postIds = isProjectFeed ? getProjectIds(state, queryProps) : getPostIds(state, queryProps)
  const hasMore = isProjectFeed ? getHasMoreProjects(state, queryProps) : getHasMorePosts(state, queryProps)

  return {
    postIds,
    communityId,
    sortBy,
    filter,
    hasMore,
    pending: !!pending,
    networkId: get('id', network),
    pendingRefresh: !!(pending && pending.extractQueryResults.reset),
    queryProps // this is just here so mergeProps can use it,
  }
}

const mapDispatchToProps = { setFilter, setSort, fetchPosts, fetchProjects, resetNewPostCount }

export function shouldResetNewPostCount ({ subject, sortBy, filter, topic }) {
  return subject === 'community' && !topic && sortBy === defaultSortBy && !filter
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { hasMore, pending, postIds, queryProps } = stateProps
  const { community, isProjectFeed } = ownProps

  const fetchPostsOrProjects = isProjectFeed ? dispatchProps.fetchProjects : dispatchProps.fetchPosts

  const fetchMorePosts = hasMore && !pending
    ? () => fetchPostsOrProjects({ ...queryProps, offset: postIds.length })
    : () => {}
  const fetchPostsAndResetCount = (params, opts) => {
    const promises = [fetchPostsOrProjects(params, opts)]
    const communityID = get('id', community)
    if (shouldResetNewPostCount(queryProps)) {
      promises.push(dispatchProps.resetNewPostCount(communityID, 'Membership'))
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