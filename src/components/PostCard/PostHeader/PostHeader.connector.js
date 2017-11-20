import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import { removePost, deletePost, pinPost } from './PostHeader.store'

export function mapStateToProps (state, props) {
  const community = getCurrentCommunity(state, props)
  const currentUser = getMe(state)
  const { creator, editPost } = props

  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canFlag = !isCreator
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    currentUser,
    community,
    editPost: canEdit ? () => editPost() : false,
    canEdit,
    canFlag,
    isCreator,
    canModerate
  }
}

export const mapDispatchToProps = {
  deletePost, removePost, pinPost
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, canEdit, isCreator, canModerate } = stateProps
  const { postId, slug } = ownProps
  const { deletePost, removePost, pinPost } = dispatchProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    deletePost: canEdit ? () => deletePost(postId) : null,
    removePost: !isCreator && canModerate ? () => removePost(postId, slug) : null,
    pinPost: canModerate && community ? () => pinPost(postId, community.id) : null
  }
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
