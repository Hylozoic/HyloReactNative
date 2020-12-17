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
  FETCH_SEARCH
} from './SearchPage.store'
import { debounce } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const searchTerm = getSearchTerm(state, props)
  const filter = getSearchFilter(state, props)

  const queryResultProps = { search: searchTerm, type: filter }

  const searchResults = getSearchResults(state, queryResultProps)
  const hasMore = getHasMoreSearchResults(state, queryResultProps)
  const pending = !!state.pending[FETCH_SEARCH]

  const goToPost = id => props.navigation.navigate('Post Details', { id })
  const goToPerson = id => props.navigation.navigate('Member', { id })

  return {
    searchTerm,
    filter,
    searchResults,
    hasMore,
    pending,
    goToPost,
    goToPerson
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchSearchResults: debounce(400, params => dispatch(fetchSearchResults(params))),
    ...bindActionCreators({
      setSearchTerm,
      setSearchFilter
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { searchTerm, filter, searchResults, hasMore } = stateProps

  const fetchSearchResults = () =>
    dispatchProps.fetchSearchResults({ search: searchTerm, filter })

  const fetchMoreSearchResults = () => hasMore
    ? dispatchProps.fetchSearchResults({ search: searchTerm, offset: searchResults.length, filter })
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchSearchResults,
    fetchMoreSearchResults
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
