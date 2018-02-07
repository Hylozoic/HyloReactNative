import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'

import getMe from '../../store/selectors/getMe'
import getNetwork from '../../store/selectors/getNetwork'
import getCommunity from '../../store/selectors/getCommunity'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import getCurrentNetworkId from '../../store/selectors/getCurrentNetworkId'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import {
  fetchCommunityTopic,
  getCommunityTopic,
  setTopicSubscribe,
  FETCH_COMMUNITY_TOPIC
} from './Feed.store'
import { mapWhenFocused, mergeWhenFocused } from 'util/connector'

export function mapStateToProps (state, props) {
  const params = get('state.params', props.navigation) || {}
  // NOTE: networkId is only received as a prop (currently via Home)
  const networkId = getCurrentNetworkId(state, props)
  // NOTE: communityId is is received either as a prop (via Home) or as a
  // navigation parameter. In case of nav params the screen will load with a
  // back button and be added to the stack.
  const communityId = getCurrentCommunityId(state, props)
  const topicName = props.topicName || params.topicName
  const community = !networkId && getCommunity(state, {id: communityId})
  const communitySlug = get('slug', community)
  const network = getNetwork(state, {id: networkId})
  const currentUser = getMe(state)
  const communityTopic = topicName && community &&
    getCommunityTopic(state, {topicName, slug: community.slug})
  const topicSubscribed = topicName && communityTopic.isSubscribed
  const topic = get('topic', communityTopic)
  return {
    currentUser,
    community,
    network,
    topic,
    postsTotal: get('postsTotal', communitySlug ? communityTopic : topic),
    followersTotal: get('followersTotal', communitySlug ? communityTopic : topic),
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
      setTopicSubscribe
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
    setTopicSubscribe: topic && communityId
      ? () => dispatchProps.setTopicSubscribe(topic.id, communityId, !topicSubscribed)
      : () => {}
  }
}

export default connect(
  mapWhenFocused(mapStateToProps),
  mapWhenFocused(mapDispatchToProps),
  mergeWhenFocused(mergeProps)
)
