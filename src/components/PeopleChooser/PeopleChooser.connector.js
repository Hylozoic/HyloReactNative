import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  setPersonInput,
  fetchSuggestions,
  fetchRecentContacts,
  getRecentContacts,
  getSuggestions,
  getInputText,
  FETCH_SUGGESTIONS,
  FETCH_CONTACTS,
  FETCH_RECENT_CONTACTS
} from './PeopleChooser.store.js'
import { isEmpty, get, debounce } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const recentContacts = getRecentContacts(state, props)
  const personInputText = getInputText(state, props)
  const suggestions = getSuggestions(state, {...props, autocomplete: personInputText})
  const people = get('state.params.participants', props.navigation) || props.people || []
  const pending = {
    suggestions: state.pending[FETCH_SUGGESTIONS],
    recent: state.pending[FETCH_RECENT_CONTACTS],
    all: state.pending[FETCH_CONTACTS]
  }

  return {
    recentContacts,
    personInputText,
    pending,
    people,
    suggestions
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchSuggestions: debounce(400, autocomplete =>
      dispatch(fetchSuggestions(autocomplete))),
    ...bindActionCreators({
      setPersonInput,
      fetchRecentContacts
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { personInputText, suggestions } = stateProps

  // don't fetch suggestions if we already have some that match the search
  const fetchSuggestions = isEmpty(personInputText) || !isEmpty(suggestions)
    ? () => {}
    : () => dispatchProps.fetchSuggestions(personInputText)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchSuggestions
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
