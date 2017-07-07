import { connect } from 'react-redux'
import { findMentions, findTopics, getResults, SearchType } from './Search.store'

function mapStateToProps (state, props) {
  const { type } = props.navigation.state.params
  return {
    results: getResults(state, props),
    type
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  const { type, communityId } = navigation.state.params
  let updateSearch
  switch (type) {
    case SearchType.MENTION:
      updateSearch = term => dispatch(findMentions(term))
      break
    case SearchType.TOPIC:
      updateSearch = term => dispatch(findTopics(term, communityId))
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
