import { connect } from 'react-redux'
import samplePost from '../PostCard/samplePost'
import { getSort, getFilter, setSort, setFilter } from './FeedList.store'

const samplePosts = [
  samplePost(), samplePost(), samplePost(), samplePost(), samplePost()
]

export function mapStateToProps (state, props) {
  return {
    posts: samplePosts,
    sortBy: getSort(state, props),
    filter: getFilter(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    loadMorePosts: () => console.log('loadMorePosts'),
    setFilter: filter => dispatch(setFilter(filter)),
    setSort: sort => dispatch(setSort(sort))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
