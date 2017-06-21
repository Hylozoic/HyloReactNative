import { connect } from 'react-redux'
import samplePost from '../PostCard/samplePost'

const samplePosts = [
  samplePost(), samplePost(), samplePost(), samplePost(), samplePost(),
]


export function mapStateToProps (state, props) {
  return {
    posts: samplePosts
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    loadMorePosts: () => console.log('loadMorePosts')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
