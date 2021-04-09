import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'lodash/fp'
import createComment from 'store/actions/createComment'
import deleteComment from 'store/actions/deleteComment'
import updateComment from 'store/actions/updateComment'
import fetchChildComments from 'store/actions/fetchChildComments'
import getGroup from 'store/selectors/getGroup'
import getMe from 'store/selectors/getMe'
import { getHasMoreChildComments, getTotalChildComments } from 'store/selectors/getChildComments'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const group = getGroup(state, { slug: props.slug })
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const canModerate = currentUser && currentUser.canModerate(group)

  return {
    // TODO: Probably going to recurse the "has more" function vs using these in this way...?
    childCommentsTotal: getTotalChildComments(state, { id: comment.id }),
    hasMoreChildComments: getHasMoreChildComments(state, { id: comment.id }),

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
    fetchCommentsMaker: cursor => () => dispatch(fetchChildComments(comment.id, { cursor })),
    createComment: commentParams => dispatch(createComment({
      postId,
      parentCommentId: commentId || comment.id,
      ...commentParams
    }))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { canModerate, isCreator } = stateProps
  const { fetchCommentsMaker } = dispatchProps
  const { comment } = ownProps

  const deleteComment = isCreator ? commentId => dispatchProps.deleteComment(commentId) : null
  const removeComment = !isCreator && canModerate ? commentId => dispatchProps.deleteComment(commentId) : null
  // TODO replace the first null below with an appropriate function call to enable comment editing.
  const editComment = isCreator ? null : null
  const updateComment = isCreator
    ? (commentId, text) => dispatchProps.updateComment(commentId, text)
    : null

  const cursor = !isEmpty(comment.childComments) && comment.childComments[0].id
  const fetchChildComments = fetchCommentsMaker(cursor)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment,
    removeComment,
    editComment,
    updateComment,
    fetchChildComments
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
