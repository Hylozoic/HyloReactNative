import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import isPendingFor from 'store/selectors/isPendingFor'
import scopedFetchRecentContacts from 'store/actions/scopedFetchRecentContacts'
import scopedGetRecentContacts from 'store/selectors/scopedGetRecentContacts'
import { showLoadingModal } from 'screens/LoadingModal/LoadingModal.store'
import {
  createMessage,
  findOrCreateThread,
  MODULE_NAME
} from './NewMessage.store.js'

export function mapStateToProps (state, props) {
  const getRecentContacts = scopedGetRecentContacts(null, { scope: MODULE_NAME })

  return {
    recentContacts: getRecentContacts(state, props),
    pending: isPendingFor(scopedFetchRecentContacts(MODULE_NAME), state)
  }
}

export const mapDispatchToProps = {
  createMessage,
  findOrCreateThread,
  showLoadingModal,
  fetchRecentContacts: scopedFetchRecentContacts(MODULE_NAME)
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
            if (!error) navigation.navigate('Thread', { id: messageThreadId })
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
