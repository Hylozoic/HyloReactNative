import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { isEmpty } from 'lodash/fp'
import {
  getHasMoreComments,
  getComments,
  getTotalComments
} from 'store/selectors/getComments'
import fetchComments from 'store/actions/fetchComments'
import { FETCH_COMMENTS } from 'store/constants'

export function mapStateToProps (state, props) {
  const comments = getComments(state, props)

  return {
    // Get comments by postId OR commentId
    comments,
    total: getTotalComments(state, { id: props.commentId || props.postId }),
    hasMore: getHasMoreComments(state, { id: props.commentId || props.postId }),
    currentUser: getMe(state),
    pending: state.pending[FETCH_COMMENTS]
  }
}

export const mapDispatchToProps = (dispatch, props) => {

  const { postId, commentId, scrollToBottom } = props
  return {
    fetchCommentsMaker: cursor => () => {
      // For now ignoring if querying on parent commentId (has more?)...
      dispatch(fetchComments(postId, { cursor }))
    },
    // Not currently used
    createComment: commentParams => dispatch(createComment({ postId, ...commentParams }))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { comments } = stateProps
  const { fetchCommentsMaker } = dispatchProps
  const cursor = !isEmpty(comments) && comments[0].id
  const fetchComments = fetchCommentsMaker(cursor)

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchComments
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
