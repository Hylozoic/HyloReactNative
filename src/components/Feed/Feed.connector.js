import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get } from 'lodash/fp'

import getMe from '../../store/selectors/getMe'
import getNetwork from '../../store/selectors/getNetwork'
import getCurrentCommunity from '../../store/selectors/getCurrentCommunity'
import getCurrentNetworkId from '../../store/selectors/getCurrentNetworkId'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import {
  fetchCommunityTopic,
  setTopicSubscribe
} from './Feed.store'
import { mapWhenFocused, mergeWhenFocused } from 'util/connector'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from '../../store/models'

const getTopicName = createSelector(
  (state, props) => props.topicName,
  (state, props) => get('state.params.TopicName', props.navigation),
  (propsTopicName, paramsTopicName) => propsTopicName || paramsTopicName
)

const getCommunityIfNetworkUnset = createSelector(
  getCurrentNetworkId,
  getCurrentCommunity,
  (networkId, community) => !networkId && community
)

const getCommunityTopic = ormCreateSelector(
  orm,
  state => state.orm,
  getTopicName,
  getCommunityIfNetworkUnset,
  (session, topicName, community) => {
    if (!topicName || !community) return false
    const topic = session.Topic.safeGet({name: topicName})
    if (!topic) return false

    return session.CommunityTopic.safeGet({
      topic: topic.id, community: community.id
    }).first()
  }
)

const getTopicSubscribed = createSelector(
  getTopicName,
  getCommunityTopic,
  (topicName, communityTopic) => topicName && communityTopic && communityTopic.isSubscribed
)

export function mapStateToProps (state, props) {
  // NOTE: networkId is only received as a prop (currently via Home)
  const networkId = getCurrentNetworkId(state)
  // NOTE: communityId is is received either as a prop (via Home) or as a
  // navigation parameter. In case of nav params the screen will load with a
  // back button and be added to the stack.
  const community = getCommunityIfNetworkUnset(state, props)
  const communitySlug = get('slug', community)
  const communityTopic = getCommunityTopic(state, props)
  const topicSubscribed = getTopicSubscribed(state, props)
  const topic = get('topic', communityTopic)
  return {
    currentUser: getMe(state),
    community: community,
    network: getNetwork(state, {id: networkId}),
    topic,
    postsTotal: get('postsTotal', communitySlug ? communityTopic : topic),
    followersTotal: get('followersTotal', communitySlug ? communityTopic : topic),
    topicName: getTopicName(state, props),
    topicSubscribed
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    newPost: (communityId, topicName) => navigation.navigate({routeName: 'PostEditor', params: {communityId, topicName}, key: 'PostEditor'}),
    showPost: id => navigation.navigate({routeName: 'PostDetails', params: {id}, key: 'PostDetails'}),
    showMember: id => navigation.navigate({routeName: 'MemberProfile', params: {id}, key: 'MemberProfile'}),
    showTopic: (communityId, networkId) => topicName => {
      // All Communities and Network feed to topic nav
      // currently not supported
      if (networkId || communityId === ALL_COMMUNITIES_ID) {
        navigation.navigate({routeName: 'TopicSupportComingSoon', key: 'TopicSupportComingSoon'})
      } else {
        navigation.navigate({routeName: 'Feed', params: {communityId, topicName}, key: 'Feed'})
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
