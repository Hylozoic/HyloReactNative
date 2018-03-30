import { connect } from 'react-redux'
import { findMentions, findTopics, getResults, getTopicSearchTerm, SearchType } from './Search.store'
import { debounce } from 'lodash'
import { validateTopicName } from 'hylo-utils/validators'

function mapStateToProps (state, props) {
  var results = getResults(state, props)

  if (props.type === SearchType.TOPIC) {
    const topicSearchTerm = getTopicSearchTerm(state)

    const validNewTopic = !results.find(t => t.name === topicSearchTerm) && !validateTopicName(topicSearchTerm)

    results = validNewTopic
      ? [ { id: topicSearchTerm, name: topicSearchTerm }, ...results ]
      : results
  }

  return {
    results
  }
}

const debouncedUpdateSearch = debounce((dispatch, term, type, communityId) => {
  switch (type) {
    case SearchType.MENTION:
      return dispatch(findMentions(term))
    case SearchType.TOPIC:
      return dispatch(findTopics(term, communityId))
  }
}, 200)

function mapDispatchToProps (dispatch, { type, communityId }) {
  return {
    updateSearch: term =>
      debouncedUpdateSearch(dispatch, term, type, communityId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
