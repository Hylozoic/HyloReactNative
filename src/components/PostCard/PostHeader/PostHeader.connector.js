import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import getCommunity from '../../../store/selectors/getCommunity'
import { removePost, deletePost } from './PostHeader.store'

export function mapStateToProps (state, props) {
  const community = getCommunity(state, {slug: props.slug})
  const currentUser = getMe(state)
  const { creator, editPost } = props

  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canFlag = !isCreator
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    currentUser,
    community,
    editPost: canEdit ? () => editPost() : null,
    canEdit,
    canFlag,
    isCreator,
    canModerate
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    deletePost: (id) => dispatch(deletePost(id)),
    removePost: (id, slug) => dispatch(removePost(id, slug))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { canEdit, isCreator, canModerate } = stateProps
  const { postId, slug } = ownProps
  const { deletePost, removePost } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: canEdit ? () => deletePost(postId) : null,
    removePost: !isCreator && canModerate ? () => removePost(postId, slug) : null
  }
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
