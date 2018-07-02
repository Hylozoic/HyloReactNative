import { connect } from 'react-redux'
import { deleteComment } from './Comment.store'
import { setCommentEdits } from '../PostDetails/CommentEditor/CommentEditor.store'
import getCommunity from '../../store/selectors/getCommunity'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const community = getCommunity(state, {slug: props.slug})
  const isCreator = currentUser && comment.creator.id === currentUser.id
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    canModerate,
    isCreator
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    editComment: (postId, text, commentId) => dispatch(setCommentEdits(postId, text, commentId)),
    deleteComment: id => dispatch(deleteComment(id))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { canModerate, isCreator } = stateProps
  const { comment } = ownProps

  const deleteComment = isCreator ? () => dispatchProps.deleteComment(comment.id) : null
  const removeComment = !isCreator && canModerate ? () => dispatchProps.deleteComment(comment.id) : null
  // TODO replace the first null below with an appropriate function call to enable comment editing.
  const editComment = isCreator ? null : null

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment,
    removeComment,
    editComment
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
