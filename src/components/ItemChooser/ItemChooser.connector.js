import { connect } from 'react-redux'
import isPendingFor from '../../store/selectors/isPendingFor'
import setQuerySearchTermForScope from '../../store/actions/setQuerySearchTermForScope'
import getQuerySearchTermForScope from '../../store/selectors/getQuerySearchTermForScope'

export function mapStateToProps (state, props) {
  const {
    getSearchSuggestions,
    fetchSearchSuggestions
  } = props
  const fetchSuggestionsActionType = fetchSearchSuggestions(undefined).type
  const searchTerm = getQuerySearchTermForScope(state, { scope: fetchSuggestionsActionType })
  // const chosenItems = get('state.params.participants', props.navigation) || props.people || []

  return {
    searchTerm,
    suggestedItems: getSearchSuggestions(state, { autocomplete: searchTerm }),
    loading: isPendingFor(fetchSuggestionsActionType, state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { fetchSearchSuggestions } = props
  const fetchSuggestionsActionType = fetchSearchSuggestions(undefined).type

  return {
    fetchSearchSuggestions: searchTerm => dispatch(fetchSearchSuggestions(searchTerm)),
    setSearchTerm: searchTerm => dispatch(setQuerySearchTermForScope(searchTerm, fetchSuggestionsActionType))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
