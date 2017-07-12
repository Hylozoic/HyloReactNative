import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import getCommunity from '../../store/selectors/getCommunity'

export function mapStateToProps (state, props) {
  const community = getCommunity(state, {id: props.communityId})
  const currentUser = getMe(state)
  return {
    currentUser,
    community
  }
}

export function mapDispatchToProps (dispatch, { navigation, communityId }) {
  return {
    newPost: () => navigation.navigate('PostEditor', {communityId}),
    showPost: id => navigation.navigate('PostDetails', {id}),
    editPost: id => navigation.navigate('PostEditor', {id}),
    showMember: id => navigation.navigate('MemberProfile', {id}),
    showTopic: topicName => navigation.navigate('Feed', {topicName})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
