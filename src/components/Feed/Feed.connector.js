import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import getNetwork from '../../store/selectors/getNetwork'
import getCommunity from '../../store/selectors/getCommunity'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import { bindActionCreators } from 'redux'
import {
  fetchCommunityTopic,
  getCommunityTopic,
  toggleTopicSubscribe,
  FETCH_COMMUNITY_TOPIC
} from './Feed.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const params = get('state.params', props.navigation) || {}
  // TODO: Can we do without navigation.params.communityId/networkId?
  const networkId = props.networkId || params.networkId
  const communityId = !networkId ? props.communityId || params.communityId : null
  const topicName = props.topicName || params.topicName
  // NOTE: Below is implicit logic to indicating whether a community or network
  // feed is to be loaded.
  const community = getCommunity(state, {id: communityId})
  const network = getNetwork(state, {id: networkId})
  const currentUser = getMe(state)
  const communityTopic = topicName && community &&
    (get(FETCH_COMMUNITY_TOPIC, state.pending) ? undefined : true) &&
    getCommunityTopic(state, {topicName, slug: community.slug})
  // when this is undefined, the subscribe button is not shown at all
  const topicSubscribed = communityTopic && communityTopic.isSubscribed
  return {
    currentUser,
    community,
    network,
    topic: get('topic', communityTopic),
    topicName,
    topicSubscribed
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
    goToCommunity: makeGoToCommunity(dispatch, navigation),
    ...bindActionCreators({
      fetchCommunityTopic,
      toggleTopicSubscribe
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, topic, topicName, topicSubscribed } = stateProps
  const communityId = get('id', community)
  const slug = get('slug', community)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    newPost: () => dispatchProps.newPost(communityId),
    showTopic: dispatchProps.showTopic(communityId),
    fetchCommunityTopic: topicName && slug
      ? () => dispatchProps.fetchCommunityTopic(topicName, slug)
      : null,
    toggleTopicSubscribe: topic && communityId
      ? () => dispatchProps.toggleTopicSubscribe(topic.id, communityId, !topicSubscribed)
      : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
