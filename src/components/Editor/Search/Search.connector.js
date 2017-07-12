import { connect } from 'react-redux'
import { findMentions, findTopics, getResults, SearchType } from './Search.store'
import { debounce } from 'lodash'

function mapStateToProps (state, props) {
  return {
    results: getResults(state, props)
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
