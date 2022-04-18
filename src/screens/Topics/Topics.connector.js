import { connect } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import fetchGroupTopics, { FETCH_GROUP_TOPICS } from 'store/actions/fetchGroupTopics'
import {
  getGroupTopics, presentGroupTopic, setTopicSubscribe, getTerm, setTerm
} from './Topics.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const searchTerm = getTerm(state)
  const group = getCurrentGroup(state, props)
  const pending = state.pending[FETCH_GROUP_TOPICS]
  const queryResultParams = {
    id: get('id', group),
    autocomplete: ''
  }
  const topicFilter = ct => ct.topic.name.toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1
  const topicSort = (a, b) => {
    if (a.isSubscribed && !b.isSubscribed) return -1
    if (!a.isSubscribed && b.isSubscribed) return 1
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  }
  const allTopics = getGroupTopics(state, queryResultParams)
  const groupHasTopics = allTopics.length > 0
  const filteredTopics = allTopics
    .filter(topicFilter)
    .map(presentGroupTopic)
    .sort(topicSort)

  return {
    pending,
    group,
    groupHasTopics,
    filteredTopics,
    searchTerm
  }
}

export const mapDispatchToProps = {
  fetchGroupTopics,
  setTopicSubscribe,
  setTerm
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { group } = stateProps
  const { navigation } = ownProps
  const groupId = group?.id
  const fetchGroupTopics = () =>
    dispatchProps.fetchGroupTopics(groupId, { first: null })
  const setTopicSubscribe = (topicId, isSubscribing) =>
    dispatchProps.setTopicSubscribe(topicId, groupId, isSubscribing)
  const goToTopic = topicName => navigation.navigate('Topic Feed', { topicName })

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchGroupTopics,
    setTopicSubscribe,
    goToTopic
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
