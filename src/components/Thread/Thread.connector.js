import { connect } from 'react-redux'
import { sanitize } from 'hylo-utils/text'

import {
  createMessage,
  fetchMessages,
  FETCH_MESSAGES,
  getHasMoreMessages,
  getThread,
  updateThreadReadTime
} from './Thread.store'
import getCurrentUserId from '../../store/selectors/getCurrentUserId'
import { sendIsTyping } from 'util/websockets'

function mapStateToProps (state, props) {
  const { id, messages, title } = getThread(state, props) || {}
  return {
    id,
    currentUserId: getCurrentUserId(state),
    hasMore: getHasMoreMessages(state, { id }),
    messages,
    pending: state.pending[FETCH_MESSAGES],
    title
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  const threadId = navigation.state.params.id
  return {
    createMessage: text => dispatch(createMessage(threadId, sanitize(text))),
    fetchMessages: cursor => dispatch(fetchMessages(threadId, { cursor })),
    reconnectFetchMessages: () => dispatch(fetchMessages(threadId, {reset: true})),
    setTitle: title => navigation.setParams({ title }),
    sendIsTyping: () => sendIsTyping(threadId, true),
    updateThreadReadTime: () => dispatch(updateThreadReadTime(threadId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
