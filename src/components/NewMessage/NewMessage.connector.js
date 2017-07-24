import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import {
  setParticipantInput,
  addParticipant,
  removeParticipant,
  getParticipants,
  fetchSuggestions,
  fetchContacts,
  fetchRecentContacts,
  getContacts,
  getRecentContacts,
  getSuggestions
 } from './NewMessage.store.js'
import { isEmpty } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const participantInputText = state.NewMessage.input

  return {
    recentContacts: getRecentContacts(state, props),
    allContacts: getContacts(state, props),
    participants: getParticipants(state, props),
    currentUser: getMe(state, props),
    suggestions: getSuggestions(state, {...props, autocomplete: participantInputText}),
    participantInputText
  }
}

export const mapDispatchToProps = {
  setParticipantInput,
  addParticipant,
  removeParticipant,
  fetchContacts,
  fetchRecentContacts,
  fetchSuggestions
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { participantInputText } = stateProps

  const fetchSuggestions = isEmpty(participantInputText)
    ? () => {}
    : () => dispatchProps.fetchSuggestions(participantInputText)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchSuggestions
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
