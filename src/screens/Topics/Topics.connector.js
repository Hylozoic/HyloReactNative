import { connect } from 'react-redux'
import getCurrentCommunity from 'store/selectors/getCurrentCommunity'
import getCurrentNetwork from 'store/selectors/getCurrentNetwork'
import selectCommunity from 'store/actions/selectCommunity'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from 'store/actions/fetchCommunityTopics'
import {
  getCommunityTopics, presentCommunityTopic, setTopicSubscribe, getTerm, setTerm
} from './Topics.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const searchTerm = getTerm(state)
  const community = getCurrentCommunity(state, props)
  const network = getCurrentNetwork(state, props)
  const pending = state.pending[FETCH_COMMUNITY_TOPICS]
  const queryResultParams = {
    id: get('id', community),
    autocomplete: ''
  }
  const topicFilter = ct => ct.topic.name.toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1
  const topicSort = (a, b) => {
    if (a.isSubscribed && !b.isSubscribed) return -1
    if (!a.isSubscribed && b.isSubscribed) return 1
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  }
  const allTopics = getCommunityTopics(state, queryResultParams)
  const communityHasTopics = allTopics.length > 0
  const filteredTopics = allTopics
    .filter(topicFilter)
    .map(presentCommunityTopic)
    .sort(topicSort)

  return {
    pending,
    community,
    communityHasTopics,
    filteredTopics,
    network,
    searchTerm
  }
}

export const mapDispatchToProps = {
  fetchCommunityTopics,
  setTopicSubscribe,
  setTerm,
  selectCommunity
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  const { navigation } = ownProps
  const communityId = community?.id
  const fetchCommunityTopics = () =>
    dispatchProps.fetchCommunityTopics(communityId, { first: null })
  const setTopicSubscribe = (topicId, isSubscribing) =>
    dispatchProps.setTopicSubscribe(topicId, communityId, isSubscribing)
  const goToTopic = topicName => navigation.navigate('Topic Feed', { topicName })

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchCommunityTopics,
    setTopicSubscribe,
    goToTopic
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
