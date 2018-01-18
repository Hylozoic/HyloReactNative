import { connect } from 'react-redux'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'
import { getCommunityTopics, presentCommunityTopic, toggleTopicSubscribe } from './Topics.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const community = getCurrentCommunity(state, props)
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
    pending
  }
}

export const mapDispatchToProps = {
  fetchCommunityTopics,
  toggleTopicSubscribe
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  const fetchCommunityTopics = () => dispatchProps.fetchCommunityTopics(get('id', community), {first: null})
  const toggleTopicSubscribe = (topicId, isSubscribing) =>
    dispatchProps.toggleTopicSubscribe(topicId, community.id, isSubscribing)
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchCommunityTopics,
    toggleTopicSubscribe
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
