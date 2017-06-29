import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import getCommunity from '../../store/selectors/getCommunity'
import { get } from 'lodash/fp'

const newPost = () => console.log('open post editor')

export function mapStateToProps (state, props) {
  const id = get('navigation.state.params.communityId', props) || 29
  const community = getCommunity(state, {id})
  const currentUser = getMe(state)
  return {
    currentUser,
    community
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    newPost
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
