import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import { isEmpty } from 'lodash/fp'
import {
  fetchComments,
  getHasMoreComments,
  getComments,
  FETCH_COMMENTS
} from './Comments.store'
import { FETCH_POST } from '../../store/actions/fetchPost'

export function mapStateToProps (state, props) {
  const pending = props.postPending ||
    state.pending[FETCH_COMMENTS] ||
    state.pending[FETCH_POST]
  const { comments, total } = getComments(state, props)
  return {
    comments,
    total,
    hasMore: getHasMoreComments(state, { id: props.postId }),
    currentUser: getMe(state),
    pending
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { postId } = props
  return {
    fetchCommentsMaker: cursor => () => dispatch(fetchComments(postId, { cursor }))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { comments } = stateProps
  const { fetchCommentsMaker } = dispatchProps
  const cursor = !isEmpty(comments) && comments[0].id
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchComments: fetchCommentsMaker(cursor)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true })
