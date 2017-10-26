import { connect } from 'react-redux'
import {
  getSort,
  getFilter,
  setSort,
  setFilter,
  getPosts,
  getHasMorePosts
} from './FeedList.store'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import { fetchPosts, FETCH_POSTS } from '../../store/actions/fetchPosts'
import { get, isNull, isUndefined, omit, omitBy } from 'lodash/fp'

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
    slug: get('slug', community) || ALL_COMMUNITIES_ID,
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
    topicName
  })

  const pending = state.pending[FETCH_POSTS]

  return {
    posts: getPosts(state, queryProps),
    sortBy,
    filter,
    hasMore: getHasMorePosts(state, queryProps),
    pending: !!pending,
    pendingRefresh: !!(pending && pending.extractQueryResults.reset),
    queryProps // this is just here so mergeProps can use it
  }
}

const mapDispatchToProps = {setFilter, setSort, fetchPosts}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { hasMore, pending, posts, queryProps } = stateProps

  const fetchMorePosts = hasMore && !pending
    ? () => dispatchProps.fetchPosts({...queryProps, offset: posts.length})
    : () => {}

  return {
    ...omit(['queryProps'], stateProps),
    ...dispatchProps,
    ...ownProps,
    fetchPosts: () => dispatchProps.fetchPosts(queryProps),
    refreshPosts: () => dispatchProps.fetchPosts(queryProps, {reset: true}),
    fetchMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
