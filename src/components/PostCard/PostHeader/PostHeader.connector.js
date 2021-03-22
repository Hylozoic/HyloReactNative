import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { removePost, deletePost, pinPost } from './PostHeader.store'
import getCanModerate from 'store/selectors/getCanModerate'

export function mapStateToProps (state, props) {
  const group = getCurrentGroup(state, props)
  const currentUser = getMe(state)
  const { creator } = props

  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canFlag = !isCreator

  return {
    currentUser,
    group,
    canEdit,
    canFlag,
    isCreator,
    canModerate: getCanModerate(state)
  }
}

export const mapDispatchToProps = {
  deletePost, removePost, pinPost
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { group, canEdit, isCreator, canModerate } = stateProps
  const { postId, slug, navigation } = ownProps
  const { deletePost, removePost, pinPost } = dispatchProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    editPost: id => navigation.navigate('Edit Post', { id }),
    deletePost: canEdit ? () => deletePost(postId) : null,
    deletePostAndClose: () => {
      if (canEdit) {
        deletePost(postId)
        navigation.goBack()
      }
    },
    removePost: !isCreator && canModerate ? () => removePost(postId, slug) : null,
    pinPost: canModerate && group ? () => pinPost(postId, group.id) : null
  }
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
