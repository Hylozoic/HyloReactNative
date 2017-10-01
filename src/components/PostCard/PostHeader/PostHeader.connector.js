import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import getCommunity from '../../../store/selectors/getCommunity'

export function mapStateToProps (state, props) {
  const community = getCommunity(state, props)
  const currentUser = getMe(state, props)
  const { creator, editPost } = props

  const canEdit = currentUser && creator && currentUser.id === creator.id
  const canFlag = currentUser && creator && currentUser.id !== creator.id
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    currentUser,
    community,
    editPost: canEdit ? () => editPost() : null,
    canEdit,
    canFlag
  }
}

export default connect(mapStateToProps)
