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
import getPerson from 'store/selectors/getPerson'

export function mapStateToProps (state, props) {
  const getRecentContacts = scopedGetRecentContacts(null, { scope: MODULE_NAME })
  const initialParticipantIds = props.route?.params?.participantIds
  const initialParticipants = initialParticipantIds
    ? initialParticipantIds.map(pId => getPerson(state, { personId: pId }))
    : []

  return {
    initialParticipants,
    recentContacts: getRecentContacts(state, props),
    pending: isPendingFor([
      scopedFetchRecentContacts(MODULE_NAME),
      findOrCreateThread,
      createMessage
    ], state)
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

  const createMessage = async (text, participantIds) => {
    // TODO: Bring back loading modal?
    // showLoadingModal(true)
    const resp = await findOrCreateThread(participantIds)

    const messageThreadId = get('payload.data.findOrCreateThread.id', resp)
    const { error } = await dispatchProps.createMessage(messageThreadId, text, true)
    if (!error) navigation.navigate('Thread', { id: messageThreadId })
    // showLoadingModal(false)
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    createMessage
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
