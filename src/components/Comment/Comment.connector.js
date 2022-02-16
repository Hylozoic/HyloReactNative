import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import createComment from 'store/actions/createComment'
import deleteComment from 'store/actions/deleteComment'
import updateComment from 'store/actions/updateComment'
import getGroup from 'store/selectors/getGroup'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const group = getGroup(state, { slug: props.slug })
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const canModerate = currentUser && currentUser.canModerate(group)

  return {
    canModerate,
    isCreator
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { postId, commentId, comment } = props
  return {
    ...bindActionCreators({
      deleteComment,
      updateComment
    }, dispatch),
    createComment: commentParams => dispatch(createComment({
      postId,
      parentCommentId: commentId || comment.id,
      ...commentParams
    }))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { canModerate, isCreator } = stateProps

  const deleteComment = isCreator ? commentId => dispatchProps.deleteComment(commentId) : null
  const removeComment = !isCreator && canModerate ? commentId => dispatchProps.deleteComment(commentId) : null

  // TODO: These are not used in this component nor is there yet a UI implemented for editing/updating comments
  const editComment = isCreator ? null : null
  const updateComment = isCreator
    ? (commentId, text) => dispatchProps.updateComment(commentId, text)
    : null

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment,
    removeComment,
    editComment,
    updateComment
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
