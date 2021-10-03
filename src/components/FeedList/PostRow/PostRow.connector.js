import { connect } from 'react-redux'
import respondToEvent from 'store/actions/respondToEvent'
import {
  makeGetPost,
  makeGetPostCommenters,
  makeGetPostGroups,
  makeGetPostCreator,
  makeGetPostTopics,
  makeGetPostImageUrls,
  makeGetPostIsPinned,
  makeGetPostFileUrls
} from './PostRow.store'

export const makeMapStateToProps = () => {
  const getPost = makeGetPost()
  const getPostCommenters = makeGetPostCommenters()
  const getPostGroups = makeGetPostGroups()
  const getPostCreator = makeGetPostCreator()
  const getPostTopics = makeGetPostTopics()
  const getPostImageUrls = makeGetPostImageUrls()
  const getPostFileUrls = makeGetPostFileUrls()
  const getPostIsPinned = makeGetPostIsPinned()

  const mapStateToProps = (state, props) => {
    const post = getPost(state, { id: props.postId })
    return {
      post: post,
      commenters: post && getPostCommenters(state, { id: props.postId }),
      groups: post && getPostGroups(state, { id: props.postId }),
      creator: post && getPostCreator(state, { id: props.postId }),
      imageUrls: post && getPostImageUrls(state, { id: props.postId }),
      fileUrls: post && getPostFileUrls(state, { id: props.postId }),
      topics: post && getPostTopics(state, { id: props.postId }),
      isPinned: post && getPostIsPinned(state, { id: props.postId, groupId: props.groupId })
    }
  }
  return mapStateToProps
}

export const mapDispatchToProps = {
  respondToEvent
}

export default connect(makeMapStateToProps, mapDispatchToProps)
