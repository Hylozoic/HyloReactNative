import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import getCommunity from '../../store/selectors/getCommunity'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.communityId', props) || 29
  const community = getCommunity(state, {id})
  const currentUser = getMe(state)
  return {
    currentUser,
    community
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  const communityId = get('state.params.communityId', navigation) || 29
  return {
    newPost: () => navigation.navigate('PostEditor', {communityId})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
