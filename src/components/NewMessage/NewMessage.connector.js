import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import {
  setParticipantInput,
  addParticipant,
  removeParticipant,
  getParticipants,
  getParticipantIds,
  fetchSuggestions,
  fetchContacts,
  fetchRecentContacts,
  getContacts,
  getRecentContacts,
  getSuggestions,
  createMessage,
  getInputText,
  getMessage,
  setMessage,
  findOrCreateThread,
  FETCH_SUGGESTIONS,
  FETCH_CONTACTS,
  FETCH_RECENT_CONTACTS
 } from './NewMessage.store.js'
import { isEmpty, get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const participantInputText = getInputText(state, props)

  const pending = {
    suggestions: state.pending[FETCH_SUGGESTIONS],
    recent: state.pending[FETCH_RECENT_CONTACTS],
    all: state.pending[FETCH_CONTACTS]
  }

  return {
    recentContacts: getRecentContacts(state, props),
    allContacts: getContacts(state, props),
    participants: getParticipants(state, props),
    participantIds: getParticipantIds(state, props),
    currentUser: getMe(state, props),
    suggestions: getSuggestions(state, {...props, autocomplete: participantInputText}),
    participantInputText,
    message: getMessage(state, props),
    pending
  }
}

export const mapDispatchToProps = {
  setParticipantInput,
  addParticipant,
  removeParticipant,
  fetchContacts,
  fetchRecentContacts,
  fetchSuggestions,
  createMessage,
  setMessage,
  findOrCreateThread
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { participantInputText, message, participantIds, suggestions } = stateProps

  // don't fetch suggestions if we already have some that match the search
  const fetchSuggestions = isEmpty(participantInputText) || !isEmpty(suggestions)
    ? () => {}
    : () => dispatchProps.fetchSuggestions(participantInputText)

  const createMessage = isEmpty(message)
    ? () => {}
    : () => dispatchProps.findOrCreateThread(participantIds)
      .then(resp => {
        console.log('creating message', message)
        const messageThreadId = get('payload.data.findOrCreateThread.id', resp)
        createMessage(messageThreadId, message, true)
      })

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchSuggestions,
    createMessage
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
