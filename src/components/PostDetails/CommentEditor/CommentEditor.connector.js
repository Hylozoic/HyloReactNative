import { connect } from 'react-redux'
import { setCommentEdits, getCommentEdits, createComment, CREATE_COMMENT } from './CommentEditor.store'
import { get } from 'lodash/fp'

function getPostId (state, props) {
  return get('navigation.state.params.postId', props)
}

export function mapStateToProps (state, props) {
  const postId = getPostId(null, props)
  const pending = !!state.pending[CREATE_COMMENT]
  return {
    content: getCommentEdits(state, {postId}),
    pending
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
