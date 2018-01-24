import { connect } from 'react-redux'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import getCurrentNetwork from '../../../store/selectors/getCurrentNetwork'
import { ALL_COMMUNITIES_ID } from '../../../store/models/Community'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'
import { getCommunityTopics, presentCommunityTopic, setTopicSubscribe } from './Topics.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const community = getCurrentCommunity(state, props)
  const network = getCurrentNetwork(state, props)
  const pending = state.pending[FETCH_COMMUNITY_TOPICS]
  const queryResultParams = {
    id: get('id', community),
    autocomplete: ''
  }
  const topics = getCommunityTopics(state, queryResultParams)
  .map(presentCommunityTopic)
  .sort((a, b) => b.newPostCount - a.newPostCount)

  return {
    community,
    topics,
    pending,
    network
  }
}

export const mapDispatchToProps = {
  fetchCommunityTopics,
  setTopicSubscribe
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, network } = stateProps
  const communityId = get('id', community)
  const fetchCommunityTopics = () => dispatchProps.fetchCommunityTopics(communityId, {first: null})
  const setTopicSubscribe = (topicId, isSubscribing) =>
    dispatchProps.setTopicSubscribe(topicId, communityId, isSubscribing)
  const goToTopic = topicName => ownProps.navigation.navigate('Feed', {topicName})

  const goToComingSoon = () => ownProps.navigation.navigate('TopicSupportComingSoon')
  const shouldRedirect = network || communityId === ALL_COMMUNITIES_ID

  console.log('network', network)
  console.log('communityId', communityId)
  console.log('shouldRedirect', shouldRedirect)

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchCommunityTopics,
    setTopicSubscribe,
    goToTopic,
    shouldRedirect,
    goToComingSoon
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
