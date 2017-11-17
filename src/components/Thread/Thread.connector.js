import { connect } from 'react-redux'
import { sanitize } from 'hylo-utils/text'

import {
  createMessage,
  fetchMessages,
  FETCH_MESSAGES,
  getHasMoreMessages,
  getThread,
  presentThread,
  updateThreadReadTime
} from './Thread.store'
import getCurrentUserId from '../../store/selectors/getCurrentUserId'
import { sendIsTyping } from 'util/websockets'

export function mapStateToProps (state, props) {
  const currentUserId = getCurrentUserId(state)
  const { id, messages, title } = presentThread(getThread(state, props), currentUserId) || {messages: []}
  return {
    id,
    currentUserId,
    hasMore: getHasMoreMessages(state, { id }),
    messages,
    pending: state.pending[FETCH_MESSAGES],
    title,
    isConnected: state.SocketListener.connected
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  const threadId = navigation.state.params.id
  return {
    createMessage: text => dispatch(createMessage(threadId, sanitize(text))),
    fetchMessages: cursor => dispatch(fetchMessages(threadId, { cursor })),
    reconnectFetchMessages: () => dispatch(fetchMessages(threadId, {reset: true})),
    sendIsTyping: () => sendIsTyping(threadId, true),
    updateThreadReadTime: () => dispatch(updateThreadReadTime(threadId))
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  const { id, title } = stateProps
  const setNavParams = title
    ? () => navigation.setParams({
      title,
      onPressTitle: () => navigation.navigate('ThreadParticipants', {id})
    })
    : () => {}
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
    setNavParams
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
