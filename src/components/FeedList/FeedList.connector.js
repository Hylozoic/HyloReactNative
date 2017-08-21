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
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import { get, omit } from 'lodash/fp'

function makeFetchOpts (props) {
  const { community } = props
  return {
    ...omit('community', props),
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
    hasMore: getHasMorePosts(state, queryProps),
    pending: state.pending[FETCH_POSTS]
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
  const { sortBy, filter, hasMore, pending, posts } = stateProps
  const { fetchPostsRaw } = dispatchProps
  const { community } = ownProps

  const fetchOpts = makeFetchOpts({community, sortBy, filter})

  const fetchPosts = () =>
    fetchPostsRaw(fetchOpts)

  const offset = posts.length

  const fetchMorePosts = hasMore && !pending
    ? () => fetchPostsRaw({...fetchOpts, offset})
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchPosts,
    fetchMorePosts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
