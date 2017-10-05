import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import getCommunity from '../../store/selectors/getCommunity'
import makeGoToCommunity from '../../store/actions/makeGoToCommunity'
import {
  fetchCommunityTopic,
  getTopicSubscriptionStatus,
  FETCH_COMMUNITY_TOPIC
} from './Feed.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const params = get('state.params', props.navigation) || {}
  const communityId = props.communityId || params.communityId
  const topicName = props.topicName || params.topicName
  const community = getCommunity(state, {id: communityId})
  const currentUser = getMe(state)

  // when this is undefined, the subscribe button is not shown at all
  const topicSubscribed = topicName && community &&
    (get(FETCH_COMMUNITY_TOPIC, state.pending) ? undefined : true) &&
    getTopicSubscriptionStatus(state, {topicName, slug: community.slug})

  return {
    currentUser,
    community,
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
    fetchTopic: (name, slug) => dispatch(fetchCommunityTopic(name, slug))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, topicName } = stateProps
  const communityId = get('id', community)
  const slug = get('slug', community)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    newPost: () => dispatchProps.newPost(communityId),
    showTopic: dispatchProps.showTopic(communityId),
    fetchTopic: topicName && slug
      ? () => dispatchProps.fetchTopic(topicName, slug)
      : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
