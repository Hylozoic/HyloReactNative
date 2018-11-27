import { connect } from 'react-redux'
import isPendingFor from '../../store/selectors/isPendingFor'
import {
  setSearchText,
  getSearchText
} from './ItemChooser.store.js'
import { debounce } from 'lodash/fp'

export function mapStateToProps (state, props) {
  // const chosenItems = get('state.params.participants', props.navigation) || props.people || []
  const searchText = getSearchText(state, props)

  return {
    searchText,
    suggestedItems: props.getSearchSuggestions(state, { autocomplete: searchText }),
    loading: isPendingFor(props.fetchSearchSuggestions, state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchSearchSuggestions: debounce(400, searchText => dispatch(props.fetchSearchSuggestions(searchText))),
    setSearchText: searchText => dispatch(setSearchText(searchText))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
