import { connect } from 'react-redux'
import { setCommentEdits, getCommentEdits, createComment } from './CommentEditor.store'

function getPostId (state, props) {
  return props.navigation.state.params.postId
}

function mapStateToProps (state, props) {
  const postId = getPostId(null, props)
  return {
    content: getCommentEdits(state, {postId})
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    setCommentEditsMaker: postId => text => dispatch(setCommentEdits(postId, text)),
    saveChangesMaker: postId => text => dispatch(createComment(postId, text))
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { setCommentEditsMaker, saveChangesMaker } = dispatchProps
  const postId = getPostId(null, ownProps)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    setCommentEdits: setCommentEditsMaker(postId),
    saveChanges: saveChangesMaker(postId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
