import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import getCommunity from '../../store/selectors/getCommunity'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const params = get('state.params', props.navigation) || {}
  const communityId = props.communityId || params.communityId
  const topicName = props.topicName || params.topicName
  const community = getCommunity(state, {id: communityId})
  const currentUser = getMe(state)
  return {
    currentUser,
    community,
    topicName
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    newPost: communityId => navigation.navigate('PostEditor', {communityId}),
    showPost: id => navigation.navigate('PostDetails', {id}),
    editPost: id => navigation.navigate('PostEditor', {id}),
    showMember: id => navigation.navigate('MemberProfile', {id}),
    showTopic: communityId => topicName =>
      navigation.navigate('Feed', {communityId, topicName}),
    goToCommunity: makeGoToCommunity(dispatch, navigation)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const communityId = get('community.id', stateProps)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    newPost: () => dispatchProps.newPost(communityId),
    showTopic: dispatchProps.showTopic(communityId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
