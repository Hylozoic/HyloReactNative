import { connect } from 'react-redux'
import samplePost from '../PostCard/samplePost'
import { getSort, getFilter, setSort, setFilter, fetchPosts } from './FeedList.store'
import { get } from 'lodash/fp'

const samplePosts = [
  samplePost(), samplePost(), samplePost(), samplePost(), samplePost()
]

export function mapStateToProps (state, props) {
  return {
    posts: samplePosts,
    sortBy: getSort(state, props),
    filter: getFilter(state, props),
    hasMore: true
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    setFilter: filter => dispatch(setFilter(filter)),
    setSort: sort => dispatch(setSort(sort)),
    fetchPostsRaw: opts => dispatch(fetchPosts(opts))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { sortBy, filter, hasMore, posts } = stateProps
  const { fetchPostsRaw } = dispatchProps
  const { community } = ownProps

  const fetchOpts = {
    subject: community ? 'community' : 'all-communities',
    id: get('id', community),
    sortBy,
    filter
  }

  const fetchPosts = () =>
    fetchPostsRaw(fetchOpts) && console.log('fetchPosts')

  const offset = posts.length

  const fetchMorePosts = hasMore
    ? () => fetchPostsRaw({...fetchOpts, offset}) && console.log('fetchPostsRaw', offset)
    : () => {console.log('dont have more')}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPosts,
    fetchMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
