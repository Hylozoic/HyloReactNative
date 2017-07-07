import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { findMentions, findTopics, getResults, SearchType } from './Search.store'

function mapStateToProps (state, props) {
  const type = get('state.params.type', props.navigation)
  return {
    results: getResults(state, props),
    type
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  const type = get('state.params.type', navigation)
  let updateSearch
  switch (type) {
    case SearchType.MENTION:
      updateSearch = term => dispatch(findMentions(term))
      break
    case SearchType.TOPIC:
      updateSearch = term => dispatch(findTopics(term))
      break
  }
  return {
    select: item => {
      navigation.goBack()
      navigation.state.params.onSelect(item)
    },
    updateSearch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
