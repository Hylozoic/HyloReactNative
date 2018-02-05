import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import getCurrentNetwork from '../../../store/selectors/getCurrentNetwork'
import getCurrentNetworkId from '../../../store/selectors/getCurrentNetworkId'
import selectCommunity from '../../../store/actions/selectCommunity'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'
import {
  getCommunityTopics, presentCommunityTopic, setTopicSubscribe, getTerm, setTerm
 } from './Topics.store'
import { get, debounce } from 'lodash/fp'

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
    autocomplete: term
  }
  const topics = getCommunityTopics(state, queryResultParams)
  .map(presentCommunityTopic)
  .sort((a, b) => b.newPostCount - a.newPostCount)

  return {
    community,
    topics,
    pending,
    network,
    term,
    networkId
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchCommunityTopics: debounce(400, (communityId, opts) =>
      dispatch(fetchCommunityTopics(communityId, opts))),
    ...bindActionCreators({
      setTopicSubscribe,
      setTerm,
      selectCommunity
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community, networkId, term } = stateProps
  const { navigation } = ownProps
  const communityId = get('id', community)
  const fetchCommunityTopics = () => dispatchProps.fetchCommunityTopics(communityId, {first: null, autocomplete: term})
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
