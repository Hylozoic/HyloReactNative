import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'

import getMe from '../../store/selectors/getMe'
import getNetwork from '../../store/selectors/getNetwork'
import getCommunity from '../../store/selectors/getCommunity'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import {
  fetchCommunityTopic,
  getCommunityTopic,
  toggleTopicSubscribe,
  FETCH_COMMUNITY_TOPIC
} from './Feed.store'
import { mapWhenFocused, mergeWhenFocused } from 'util/connector'

export function mapStateToProps (state, props) {
  const params = get('state.params', props.navigation) || {}
  // NOTE: networkId is only received as a prop (currently via Home)
  const networkId = props.networkId
  // NOTE: communityId is is received either as a prop (via Home) or as a
  // navigation parameter. In case of nav params the screen will load with a
  // back button and be added to the stack.
  const communityId = params.communityId || props.communityId
  const topicName = props.topicName || params.topicName
  const community = !networkId && getCommunity(state, {id: communityId})
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
    newPost: (communityId, topicName) => navigation.navigate('PostEditor', {communityId, topicName}),
    showPost: id => navigation.navigate('PostDetails', {id}),
    editPost: id => navigation.navigate('PostEditor', {id}),
    showMember: id => navigation.navigate('MemberProfile', {id}),
    showTopic: (communityId, networkId) => topicName => {
      // All Communities and Network feed to topic nav
      // currently not supported
      if (networkId || communityId === ALL_COMMUNITIES_ID) {
        navigation.navigate('TopicSupportComingSoon')
      } else {
        navigation.navigate('Feed', {communityId, topicName})
      }
    },
    goToCommunity: makeGoToCommunity(dispatch, navigation),
    ...bindActionCreators({
      fetchCommunityTopic,
      toggleTopicSubscribe
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, network, topic, topicName, topicSubscribed } = stateProps
  const communityId = get('id', community)
  const networkId = get('id', network)
  const slug = get('slug', community)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    newPost: () => dispatchProps.newPost(communityId, topicName),
    showTopic: dispatchProps.showTopic(communityId, networkId),
    fetchCommunityTopic: topicName && slug
      ? () => dispatchProps.fetchCommunityTopic(topicName, slug)
      : () => {},
    toggleTopicSubscribe: topic && communityId
      ? () => dispatchProps.toggleTopicSubscribe(topic.id, communityId, !topicSubscribed)
      : () => {}
  }
}

export default connect(
  mapWhenFocused(mapStateToProps),
  mapWhenFocused(mapDispatchToProps),
  mergeWhenFocused(mergeProps)
)
