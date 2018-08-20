import { connect } from 'react-redux'
import {
  createMessage,
  findOrCreateThread
} from './NewMessage.store.js'
import { showLoadingModal } from '../LoadingModal/LoadingModal.store'
import { isEmpty, get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {}
}

export const mapDispatchToProps = {
  createMessage,
  findOrCreateThread,
  showLoadingModal
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { participantInputText, participantIds, suggestions } = stateProps
  const { showLoadingModal, findOrCreateThread } = dispatchProps
  const { navigation } = ownProps

  // don't fetch suggestions if we already have some that match the search
  const fetchSuggestions = isEmpty(participantInputText) || !isEmpty(suggestions)
    ? () => {}
    : () => dispatchProps.fetchSuggestions(participantInputText)

  const createMessage = text => {
    showLoadingModal(true)
    return findOrCreateThread(participantIds)
      .then(resp => {
        const messageThreadId = get('payload.data.findOrCreateThread.id', resp)
        dispatchProps.createMessage(messageThreadId, text, true)
          .then(({ error }) => {
            if (!error) navigation.navigate({routeName: 'Thread', params: {id: messageThreadId}, key: 'Thread'})
            showLoadingModal(false)
          })
      })
  }

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
