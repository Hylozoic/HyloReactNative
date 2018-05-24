import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchSearchResults,
  setSearchTerm,
  getSearchTerm,
  setSearchFilter,
  getSearchFilter,
  getSearchResults,
  getHasMoreSearchResults,
  FETCH_SEARCH_RESULTS
} from './SearchPage.store'

export function mapStateToProps (state, props) {
  const searchTerm = getSearchTerm(state, props)
  const filter = getSearchFilter(state, props)

  const queryResultProps = {search: searchTerm, type: filter}

  const searchResults = getSearchResults(state, queryResultProps)
  const hasMore = getHasMoreSearchResults(state, queryResultProps)
  const pending = !!state.pending[FETCH_SEARCH_RESULTS]

  return {
    searchTerm,
    filter,
    searchResults,
    hasMore,
    pending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      fetchSearchResults,
      setSearchTerm,
      setSearchFilter
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { searchTerm, filter, searchResults } = stateProps

  const fetchSearchResults = () =>
    dispatchProps.fetchSearchResults({search: searchTerm, filter})

  const fetchMoreSearchResults = () =>
    dispatchProps.fetchSearchResults({search: searchTerm, offset: searchResults.length, filter})

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchSearchResults
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
