import { connect } from 'react-redux'
import {
  getSort,
  getFilter,
  setSort,
  setFilter,
  fetchPosts,
  getPosts,
  getHasMorePosts,
  ALL_COMMUNITIES_ID
} from './FeedList.store'
import { get } from 'lodash/fp'

function makeFetchOpts (props) {
  const { community } = props
  return {
    ...props,
    subject: community ? 'community' : 'all-communities',
    slug: get('slug', community) || ALL_COMMUNITIES_ID
  }
}

export function mapStateToProps (state, props) {
  const sortBy = getSort(state, props)
  const filter = getFilter(state, props)
  const { community } = props

  const queryProps = makeFetchOpts({
    community,
    sortBy,
    filter
  })

  return {
    posts: getPosts(state, queryProps),
    sortBy,
    filter,
    hasMore: getHasMorePosts(state, queryProps)
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

  const fetchOpts = makeFetchOpts({community, sortBy, filter})

  const fetchPosts = () =>
    fetchPostsRaw(fetchOpts)

  const offset = posts.length

  const fetchMorePosts = hasMore
    ? () => fetchPostsRaw({...fetchOpts, offset})
    : () => { }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPosts,
    fetchMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
