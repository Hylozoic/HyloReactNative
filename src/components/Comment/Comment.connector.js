import { connect } from 'react-redux'
import { deleteComment } from './Comment.store'
import getCommunity from '../../store/selectors/getCommunity'
import getMe from '../../store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const community = getCommunity(state, {slug: props.slug})
  const canModerate = currentUser && (comment.creator.id === currentUser.id ||
    currentUser.canModerate(community))

  return {
    canModerate
  }
}

export const mapDispatchToProps = {
  deleteComment
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { canModerate } = stateProps
  const { comment } = ownProps

  const deleteComment = canModerate
    ? () => dispatchProps.deleteComment(comment.id)
    : null

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
