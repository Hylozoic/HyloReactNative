import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import getCommunity from '../../store/selectors/getCommunity'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const communityId = props.communityId || props.navigation.state.params.communityId
  const community = getCommunity(state, {id: communityId})
  const currentUser = getMe(state)
  return {
    currentUser,
    community
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    newPost: communityId => navigation.navigate('PostEditor', {communityId}),
    showPost: id => navigation.navigate('PostDetails', {id}),
    editPost: id => navigation.navigate('PostEditor', {id}),
    showMember: id => navigation.navigate('MemberProfile', {id}),
    showTopic: topicName => navigation.navigate('Feed', {topicName})
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  const { newPost } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    newPost: () => newPost(get('id', community))
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
