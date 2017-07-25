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
  findOrCreateThread
 } from './NewMessage.store.js'
import { isEmpty, get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const participantInputText = getInputText(state, props)

  return {
    recentContacts: getRecentContacts(state, props),
    allContacts: getContacts(state, props),
    participants: getParticipants(state, props),
    participantIds: getParticipantIds(state, props),
    currentUser: getMe(state, props),
    suggestions: getSuggestions(state, {...props, autocomplete: participantInputText}),
    participantInputText,
    message: getMessage(state, props)
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
  const { participantInputText, message, participantIds } = stateProps

  const fetchSuggestions = isEmpty(participantInputText)
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
