import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import { removePost, deletePost, pinPost } from './PostHeader.store'
import getCanModerate from '../../../store/selectors/getCanModerate'

export function mapStateToProps (state, props) {
  const community = getCurrentCommunity(state, props)
  const currentUser = getMe(state)
  const { creator } = props

  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canFlag = !isCreator

  return {
    currentUser,
    community,
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
  const { community, canEdit, isCreator, canModerate } = stateProps
  const { postId, slug, navigation } = ownProps
  const { deletePost, removePost, pinPost } = dispatchProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    editPost: id => navigation.navigate({routeName: 'PostEditor', params: {id}, key: 'PostEditor'}),
    deletePost: canEdit ? () => deletePost(postId) : null,
    deletePostAndClose: () => {
      if (canEdit) {
        deletePost(postId)
        navigation.goBack()
      }
    },
    removePost: !isCreator && canModerate ? () => removePost(postId, slug) : null,
    pinPost: canModerate && community ? () => pinPost(postId, community.id) : null
  }
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
