import { connect } from 'react-redux'
import { get, isNull, isUndefined, omit, omitBy } from 'lodash/fp'

import {
  getSort,
  getFilter,
  setSort,
  setFilter,
  getPostIds,
  getHasMorePosts,
  defaultSortBy
} from './FeedList.store'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import fetchPosts, { FETCH_POSTS } from '../../store/actions/fetchPosts'
import resetNewPostCount from '../../store/actions/resetNewPostCount'

function makeFetchOpts (props) {
  const { community, network, topicName } = props
  var subject

  if (community) {
    subject = 'community'
  } else if (network) {
    subject = 'network'
  } else {
    subject = 'all-communities'
  }
  return omitBy(x => isNull(x) || isUndefined(x), {
    ...omit(['community', 'network', 'topicName'], props),
    subject,
    slug: get('slug', community) || (!network && ALL_COMMUNITIES_ID),
    networkSlug: get('slug', network),
    topic: topicName
  })
}

export function mapStateToProps (state, props) {
  const sortBy = getSort(state, props)
  const filter = getFilter(state, props)
  const { community, network, topicName } = props
  const queryProps = makeFetchOpts({
    community,
    network,
    sortBy,
    filter,

    // TODO: Establish whether `topic` is necessary here?
    // Removing `topicName` breaks topic feeds.
    topic: topicName,
    topicName
  })
  const pending = state.pending[FETCH_POSTS]
  const communityId = get('community.id', props)

  return {
    postIds: getPostIds(state, queryProps),
    communityId,
    sortBy,
    filter,
    hasMore: getHasMorePosts(state, queryProps),
    pending: !!pending,
    networkId: get('id', network),
    pendingRefresh: !!(pending && pending.extractQueryResults.reset),
    queryProps // this is just here so mergeProps can use it
  }
}

const mapDispatchToProps = {setFilter, setSort, fetchPosts, resetNewPostCount}

export function shouldResetNewPostCount ({subject, sortBy, filter, topic}) {
  return subject === 'community' && !topic && sortBy === defaultSortBy && !filter
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { hasMore, pending, postIds, queryProps } = stateProps
  const { community } = ownProps
  const fetchMorePosts = hasMore && !pending
    ? () => dispatchProps.fetchPosts({...queryProps, offset: postIds.length})
    : () => {}
  const fetchPostsAndResetCount = (params, opts) => {
    const promises = [dispatchProps.fetchPosts(params, opts)]
    const communityID = get('id', community)
    if (shouldResetNewPostCount(queryProps)) {
      promises.push(dispatchProps.resetNewPostCount(communityID, 'Membership'))
    }
    return Promise.all(promises)
  }

  return {
    ...omit(['queryProps'], stateProps),
    ...dispatchProps,
    ...ownProps,
    fetchPosts: () => fetchPostsAndResetCount(queryProps),
    refreshPosts: () => fetchPostsAndResetCount(queryProps, {reset: true}),
    fetchMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
