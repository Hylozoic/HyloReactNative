import { connect } from 'react-redux'
import {
  getSort,
  getFilter,
  setSort,
  setFilter,
  getPosts,
  getHasMorePosts,
  defaultSortBy
} from './FeedList.store'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import { fetchPosts, FETCH_POSTS } from '../../store/actions/fetchPosts'
import resetNewPostCount from '../../store/actions/resetNewPostCount'
import { get, isNull, isUndefined, omit, omitBy } from 'lodash/fp'

function makeFetchOpts (props) {
  const { community, topicName } = props
  return omitBy(x => isNull(x) || isUndefined(x), {
    ...omit(['community', 'topicName'], props),
    subject: community ? 'community' : 'all-communities',
    slug: get('slug', community) || ALL_COMMUNITIES_ID,
    topic: topicName
  })
}

export function mapStateToProps (state, props) {
  const { community, isFocused, topicName } = props
  if (!isFocused) return props

  const sortBy = getSort(state, props)
  const filter = getFilter(state, props)

  const queryProps = makeFetchOpts({
    community,
    sortBy,
    filter,
    topicName
  })

  const pending = state.pending[FETCH_POSTS]

  return {
    filter,
    hasMore: getHasMorePosts(state, queryProps),
    isFocused,
    pending: !!pending,
    pendingRefresh: !!(pending && pending.extractQueryResults.reset),
    posts: getPosts(state, queryProps),
    sortBy,
    queryProps // this is just here so mergeProps can use it
  }
}

const mapDispatchToProps = {setFilter, setSort, fetchPosts, resetNewPostCount}

export function shouldResetNewPostCount ({subject, sortBy, filter, topic}) {
  return subject === 'community' && !topic && sortBy === defaultSortBy && !filter
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  if (!ownProps.isFocused) return ownProps

  const { hasMore, pending, posts, queryProps } = stateProps

  const fetchMorePosts = hasMore && !pending
    ? () => dispatchProps.fetchPosts({...queryProps, offset: posts.length})
    : () => {}

  const fetchPostsAndResetCount = (params, opts) => {
    const promises = [dispatchProps.fetchPosts(params, opts)]
    const communityID = get('id', ownProps.community)
    if (shouldResetNewPostCount(queryProps)) {
      promises.push(dispatchProps.resetNewPostCount(communityID, 'Membership'))
    }
    return Promise.all(promises)
  }
  // topic
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
