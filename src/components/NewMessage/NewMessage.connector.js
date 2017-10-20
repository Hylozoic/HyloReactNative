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
import { setLoadingModal } from '../LoadingModal/LoadingModal.store'
import { isEmpty, get, debounce, throttle } from 'lodash/fp'

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
    fetchContacts: throttle(1000, (first, offset) =>
      dispatch(fetchContacts(first, offset))),
    ...bindActionCreators({
      setParticipantInput,
      setParticipants,
      addParticipant,
      removeParticipant,
      fetchRecentContacts,
      createMessage,
      setMessage,
      findOrCreateThread,
      setLoadingModal
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    participantInputText, message, participantIds, suggestions, allContacts, pending
  } = stateProps
  const {
    setLoadingModal, findOrCreateThread
  } = dispatchProps
  const { navigation } = ownProps

  // don't fetch suggestions if we already have some that match the search
  const fetchSuggestions = isEmpty(participantInputText) || !isEmpty(suggestions)
    ? () => {}
    : () => dispatchProps.fetchSuggestions(participantInputText)

  const createMessage = isEmpty(message)
    ? () => {}
    : () => {
      setLoadingModal(true)
      return findOrCreateThread(participantIds)
      .then(resp => {
        const messageThreadId = get('payload.data.findOrCreateThread.id', resp)
        dispatchProps.createMessage(messageThreadId, message, true)
        .then(({ error }) => {
          if (!error) navigation.navigate('Thread', {id: messageThreadId})
          setLoadingModal(false)
        })
      })
    }

  const participantsFromParams = get('state.params.participants', navigation)
  const loadParticipantsFromParams = participantsFromParams
    ? () => dispatchProps.setParticipants(participantsFromParams)
    : () => {}

  const offset = allContacts.length

  const fetchMoreContacts = pending.all
    ? () => {}
    : () => dispatchProps.fetchContacts(10, offset)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchSuggestions,
    createMessage,
    loadParticipantsFromParams,
    fetchMoreContacts
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
