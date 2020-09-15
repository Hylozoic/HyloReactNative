import { connect } from 'react-redux'
import isPendingFor from '../../store/selectors/isPendingFor'
import {
  getSearchTerm,
  setSearchTerm,
  getSearchSuggestions as defaultGetSearchSuggestions
} from './ItemChooser.store'

export function mapStateToProps (state, props) {
  const scope = props.screenTitle
  const searchTerm = getSearchTerm(state, { scope })
  const getSearchSuggestions = props.getSearchSuggestions
    ? props.getSearchSuggestions
    : defaultGetSearchSuggestions

  return {
    searchTerm,
    suggestedItems: getSearchSuggestions(state, { scope, searchTerm, autocomplete: searchTerm }),
    loading: isPendingFor(scope, state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { fetchSearchSuggestions, screenTitle } = props
  const scope = screenTitle

  return {
    fetchSearchSuggestions: searchTerm => dispatch(fetchSearchSuggestions(scope, searchTerm)),
    setSearchTerm: searchTerm => dispatch(setSearchTerm(scope, searchTerm))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
