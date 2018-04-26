import { connect } from 'react-redux'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import getCurrentNetwork from '../../../store/selectors/getCurrentNetwork'
import getCurrentNetworkId from '../../../store/selectors/getCurrentNetworkId'
import selectCommunity from '../../../store/actions/selectCommunity'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'
import {
  getCommunityTopics, presentCommunityTopic, setTopicSubscribe, getTerm, setTerm
 } from './Topics.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const term = getTerm(state)
  const community = getCurrentCommunity(state, props)
  const network = getCurrentNetwork(state, props)
  // we have to fetch networkId separately here because in the case where it is
  // ALL_COMMUNITIES_ID, getCurrentNetwork will be null, but we still need to check
  // if networkId is set
  const networkId = getCurrentNetworkId(state, props)
  const pending = state.pending[FETCH_COMMUNITY_TOPICS]
  const queryResultParams = {
    id: get('id', community),
    autocomplete: ''
  }

  const lowcaseTerm = term && term.toLowerCase()

  const topicFilter = ct => ct.topic.name.toLowerCase().indexOf(lowcaseTerm) > -1
  const topicSort = (a, b) => {
    if (a.isSubscribed && !b.isSubscribed) return -1
    if (!a.isSubscribed && b.isSubscribed) return 1
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  }

  const topics = getCommunityTopics(state, queryResultParams)
    .filter(topicFilter)
    .map(presentCommunityTopic)
    .sort(topicSort)

  return {
    community,
    topics,
    pending,
    network,
    term,
    networkId
  }
}

export const mapDispatchToProps = {
  fetchCommunityTopics,
  setTopicSubscribe,
  setTerm,
  selectCommunity
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, networkId } = stateProps
  const { navigation } = ownProps
  const communityId = get('id', community)
  const fetchCommunityTopics = () =>
    dispatchProps.fetchCommunityTopics(communityId, {first: null})

  const setTopicSubscribe = (topicId, isSubscribing) =>
    dispatchProps.setTopicSubscribe(topicId, communityId, isSubscribing)
  const goToTopic = topicName => navigation.navigate('Feed', {topicName})

  // previous communityId gets passed here so we can get out of
  // network/all communities
  // this is a hack to handle the fact that we have pseudo navigation events (changing community/network)
  // which don't go on the router navigation stack
  const onBackFromComingSoon = () => {
    navigation.navigate('Home')
  }

  const goToComingSoon = () => {
    navigation.navigate('TopicSupportComingSoon', {onBack: onBackFromComingSoon})
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
