import { connect } from 'react-redux'
import {
  makeGetPost,
  makeGetPostCommenters,
  makeGetPostCommunities,
  makeGetPostCreator,
  makeGetPostTopics,
  makeGetPostImageUrls,
  makeGetPostIsPinned
} from './PostRow.store'

const makeMapStateToProps = () => {
  const getPost = makeGetPost()
  const getPostCommenters = makeGetPostCommenters()
  const getPostCommunities = makeGetPostCommunities()
  const getPostCreator = makeGetPostCreator()
  const getPostTopics = makeGetPostTopics()
  const getPostImageUrls = makeGetPostImageUrls()
  const getPostIsPinned = makeGetPostIsPinned()

  const mapStateToProps = (state, props) => {
    const post = getPost(state, {id: props.postId})
    return {
      post: post,
      commenters: post && getPostCommenters(state, {id: props.postId}),
      communities: post && getPostCommunities(state, {id: props.postId}),
      creator: post && getPostCreator(state, {id: props.postId}),
      imageUrls: post && getPostImageUrls(state, {id: props.postId}),
      topics: post && getPostTopics(state, {id: props.postId}),
      isPinned: post && getPostIsPinned(state, {id: props.postId, communityId: props.communityId})
    }
  }
  return mapStateToProps
}

export default connect(makeMapStateToProps)
