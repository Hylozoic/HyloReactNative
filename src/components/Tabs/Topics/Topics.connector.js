import { connect } from 'react-redux'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import getCurrentNetwork from '../../../store/selectors/getCurrentNetwork'
import getCurrentNetworkId from '../../../store/selectors/getCurrentNetworkId'
import selectCommunity from '../../../store/actions/selectCommunity'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'
import { getCommunityTopics, presentCommunityTopic, setTopicSubscribe } from './Topics.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const community = getCurrentCommunity(state, props)
  const network = getCurrentNetwork(state, props)
  // we have to fetch networkId separately here because in the case where it is
  // ALL_COMMUNITIES_ID, getCurrentNetwork will be null, but we still need to check
  // if networkId is set
  const networkId = getCurrentNetworkId(state, props)
  console.log('community', community.id)
  console.log('network', networkId)
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
    network,
    networkId
  }
}

export const mapDispatchToProps = {
  fetchCommunityTopics,
  setTopicSubscribe,
  selectCommunity
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, networkId } = stateProps
  const { navigation } = ownProps
  const communityId = get('id', community)
  const fetchCommunityTopics = () => dispatchProps.fetchCommunityTopics(communityId, {first: null})
  const setTopicSubscribe = (topicId, isSubscribing) =>
    dispatchProps.setTopicSubscribe(topicId, communityId, isSubscribing)
  const goToTopic = topicName => navigation.navigate('Feed', {topicName})

  // previous communityId gets passed here so we can get out of
  // network/all communities
  // this is a hack to handle the fact that we have pseudo navigation events (changing community/network)
  // which don't go on the router navigation stack
  const onBackFromComingSoon = prevCommunityId => () => {
    console.log('COMING BACK', prevCommunityId)
    if (!prevCommunityId && networkId) {
      // we came from the network feed, so we should go back!
      console.log('Going back to the feed')
      navigation.navigate('Feed')
    } else if (prevCommunityId) {
      // we came from a community topics list to a network topics list
      dispatchProps.selectCommunity(prevCommunityId)
    }
  }

  const goToComingSoon = prevCommunityId => {
    console.log('GOING', prevCommunityId)
    navigation.navigate('TopicSupportComingSoon', {onBack: onBackFromComingSoon(prevCommunityId)})
  }

  const shouldRedirect = !!networkId

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
