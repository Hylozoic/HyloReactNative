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
    return {
      post: getPost(state, {id: props.postId}),
      commenters: getPostCommenters(state, {id: props.postId}),
      communities: getPostCommunities(state, {id: props.postId}),
      creator: getPostCreator(state, {id: props.postId}),
      imageUrls: getPostImageUrls(state, {id: props.postId}),
      topics: getPostTopics(state, {id: props.postId}),
      isPinned: getPostIsPinned(state, {id: props.postId, communityId: props.communityId})
    }
  }
  return mapStateToProps
}

export default connect(makeMapStateToProps)
