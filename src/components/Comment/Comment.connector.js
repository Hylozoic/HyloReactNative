import { connect } from 'react-redux'
import { deleteComment } from './Comment.store'
import { Alert } from 'react-native'
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

  const deleteCommentWithConfirm = canModerate
    ? () => Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this comment?',
      [
        {text: 'Yes', onPress: () => dispatchProps.deleteComment(comment.id)},
        {text: 'Cancel', style: 'cancel'}
      ])
    : null
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment: deleteCommentWithConfirm
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
