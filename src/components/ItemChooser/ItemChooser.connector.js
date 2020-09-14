import { connect } from 'react-redux'
import isPendingFor from '../../store/selectors/isPendingFor'
import setQuerySearchTermForScope from '../../store/actions/setQuerySearchTermForScope'
import getQuerySearchTermForScope from '../../store/selectors/getQuerySearchTermForScope'

export function mapStateToProps (state, props) {
  const { getSearchSuggestions, screenTitle } = props
  const searchTerm = getQuerySearchTermForScope(state, { scope: screenTitle })

  return {
    searchTerm,
    suggestedItems: getSearchSuggestions(state, { autocomplete: searchTerm }),
    loading: isPendingFor(screenTitle, state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { fetchSearchSuggestions, screenTitle } = props

  return {
    fetchSearchSuggestions: searchTerm => dispatch(fetchSearchSuggestions(searchTerm)),
    setSearchTerm: searchTerm => dispatch(setQuerySearchTermForScope(searchTerm, screenTitle))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
