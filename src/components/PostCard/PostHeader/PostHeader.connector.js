import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import getCommunity from '../../../store/selectors/getCommunity'

export function mapStateToProps (state, props) {
  const community = getCommunity(state, props)
  return {
    currentUser: getMe(state, props),
    community
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, community } = stateProps
  const { creator, editPost } = ownProps
  const canEdit = currentUser && creator && currentUser.id === creator.id
  const canFlag = currentUser && creator && currentUser.id !== creator.id
  const canModerate = currentUser && currentUser.canModerate(community)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    editPost: canEdit ? () => editPost() : null,
    canEdit,
    canFlag
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
