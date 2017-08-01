import { connect } from 'react-redux'
import { sanitize } from 'hylo-utils/text'

import {
  createMessage,
  fetchMessages,
  FETCH_MESSAGES,
  getMessages,
  getMeForThread
} from './Thread.store'

function mapStateToProps (state, props) {
  return {
    currentUser: getMeForThread(state),
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
