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
  const { community, topicName } = props
  return omitBy(x => isNull(x) || isUndefined(x), {
    ...omit(['community', 'topicName'], props),
    subject: community ? 'community' : 'all-communities',
    slug: get('slug', community) || ALL_COMMUNITIES_ID,
    topic: topicName
  })
}

export function mapStateToProps (state, props) {
  const sortBy = getSort(state, props)
  const filter = getFilter(state, props)
  const { community, topicName } = props

  const queryProps = makeFetchOpts({
    community,
    sortBy,
    filter,
    topicName
  })

  return {
    posts: getPosts(state, queryProps),
    sortBy,
    filter,
    hasMore: getHasMorePosts(state, queryProps),
    pending: state.pending[FETCH_POSTS],
    queryProps // this is just here so mergeProps can use it
  }
}

const mapDispatchToProps = {setFilter, setSort, fetchPosts}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { hasMore, pending, posts, queryProps } = stateProps
  const fetchPosts = () => dispatchProps.fetchPosts(queryProps)

  const fetchMorePosts = hasMore && !pending
    ? () => dispatchProps.fetchPosts({...queryProps, offset: posts.length})
    : () => {}

  return {
    ...omit(['queryProps'], stateProps),
    ...dispatchProps,
    ...ownProps,
    fetchPosts,
    fetchMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
