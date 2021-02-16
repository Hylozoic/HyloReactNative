import { connect } from 'react-redux'
import isPendingFor from 'store/selectors/isPendingFor'
import {
  getScope,
  getSearchTerm,
  setSearchTerm,
  getSearchSuggestions as defaultGetSearchSuggestions
} from './ItemChooser.store'

export function mapStateToProps (state, props) {
  const scope = getScope({}, props)
  const searchTerm = getSearchTerm(state, props)
  const getSearchSuggestions = props.route.params.getSearchSuggestions
    ? props.route.params.getSearchSuggestions
    : defaultGetSearchSuggestions

    return {
    searchTerm,
    suggestedItems: getSearchSuggestions(state, { ...props, searchTerm, autocomplete: searchTerm }),
    loading: isPendingFor(scope, state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const scope = getScope({}, props)
  const { fetchSearchSuggestions, searchTermFilter } = props.route.params

  return {
    fetchSearchSuggestions: searchTerm => dispatch(fetchSearchSuggestions(searchTerm)),
    setSearchTerm: (searchTerm, opts) => dispatch(setSearchTerm(scope, searchTerm, { ...opts, searchTermFilter }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
