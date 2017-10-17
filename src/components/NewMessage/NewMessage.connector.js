import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  setParticipantInput,
  addParticipant,
  removeParticipant,
  setParticipants,
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
import { isEmpty, get, debounce } from 'lodash/fp'

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
    suggestions: getSuggestions(state, {...props, autocomplete: participantInputText}),
    participantInputText,
    message: getMessage(state, props),
    pending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchSuggestions: debounce(400, autocomplete =>
      dispatch(fetchSuggestions(autocomplete))),
    ...bindActionCreators({
      setParticipantInput,
      setParticipants,
      addParticipant,
      removeParticipant,
      fetchContacts,
      fetchRecentContacts,
      createMessage,
      setMessage,
      findOrCreateThread
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  const { participantInputText, message, participantIds, suggestions } = stateProps

  // don't fetch suggestions if we already have some that match the search
  const fetchSuggestions = isEmpty(participantInputText) || !isEmpty(suggestions)
    ? () => {}
    : () => dispatchProps.fetchSuggestions(participantInputText)

  const createMessage = isEmpty(message)
    ? () => {}
    : () => dispatchProps.findOrCreateThread(participantIds)
      .then(resp => {
        const messageThreadId = get('payload.data.findOrCreateThread.id', resp)
        dispatchProps.createMessage(messageThreadId, message, true)
        .then(({ error }) => {
          if (!error) navigation.navigate('Thread', {id: messageThreadId})
        })
      })

  const participantsFromParams = get('state.params.participants', navigation)
  const loadParticipantsFromParams = participantsFromParams
    ? () => dispatchProps.setParticipants(participantsFromParams)
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchSuggestions,
    createMessage,
    loadParticipantsFromParams
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
