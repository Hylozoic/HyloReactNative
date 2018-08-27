import { connect } from 'react-redux'
import {
  createMessage,
  findOrCreateThread
} from './NewMessage.store.js'
import { showLoadingModal } from '../LoadingModal/LoadingModal.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {}
}

export const mapDispatchToProps = {
  createMessage,
  findOrCreateThread,
  showLoadingModal
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { showLoadingModal, findOrCreateThread } = dispatchProps
  const { navigation } = ownProps

  const createMessage = (text, participantIds) => {
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

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    createMessage
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
