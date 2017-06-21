import { connect } from 'react-redux'
import samplePost from '../PostCard/samplePost'

const samplePosts = [
  samplePost(), samplePost(), samplePost(), samplePost(), samplePost()
]

export function mapStateToProps (state, props) {
  return {
    posts: samplePosts,
    sortBy: 'votes',
    filter: 'request'
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    loadMorePosts: () => console.log('loadMorePosts'),
    setFilter: filter => console.log('setFilter', filter),
    setSort: sort => console.log('setSort', sort)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
