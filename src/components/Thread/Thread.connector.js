import { connect } from 'react-redux'
import { sanitize } from 'hylo-utils/text'

import {
  createMessage,
  fetchMessages,
  FETCH_MESSAGES,
  getMessages,
  getMyAvatar
} from './Thread.store'

function mapStateToProps (state, props) {
  return {
    avatarUrl: getMyAvatar(state),
    messages: getMessages(state, props),
    pending: state.pending[FETCH_MESSAGES]
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  const threadId = navigation.state.params.id
  return {
    createMessage: text => dispatch(createMessage(threadId, sanitize(text))),
    fetchMessages: () => dispatch(fetchMessages(threadId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
