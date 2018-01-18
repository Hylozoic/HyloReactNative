import { connect } from 'react-redux'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import fetchCommunityTopics, { FETCH_COMMUNITY_TOPICS } from '../../../store/actions/fetchCommunityTopics'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { makeGetQueryResults } from '../../../store/reducers/queryResults'
import { get, includes, isEmpty } from 'lodash/fp'

const getCommunityTopicResults = makeGetQueryResults(FETCH_COMMUNITY_TOPICS)

export const getCommunityTopics = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunityTopicResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.CommunityTopic.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

function presentCommunityTopic (communityTopic) {
  return {
    ...communityTopic.topic.ref,
    isSubscribed: communityTopic.isSubscribed,
    newPostCount: communityTopic.newPostCount
  }
}

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
  fetchCommunityTopics
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  const fetchCommunityTopics = () => dispatchProps.fetchCommunityTopics(community.id, {first: null})
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchCommunityTopics
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
