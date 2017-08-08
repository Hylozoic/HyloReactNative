import { connect } from 'react-redux'
import { sanitize } from 'hylo-utils/text'
import { pick } from 'lodash/fp'

import {
  createMessage,
  fetchMessages,
  FETCH_MESSAGES,
  getMeForThread,
  getThread,
  MESSAGE_PAGE_SIZE
} from './Thread.store'

function mapStateToProps (state, props) {
  const { messages, title } = pick([ 'messages', 'title' ], getThread(state, props))
  return {
    currentUser: getMeForThread(state),
    messages,
    pageSize: MESSAGE_PAGE_SIZE,
    pending: state.pending[FETCH_MESSAGES],
    title
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  const threadId = navigation.state.params.id
  return {
    createMessage: text => dispatch(createMessage(threadId, sanitize(text))),
    fetchMessages: () => dispatch(fetchMessages(threadId)),
    setTitle: title => {
      navigation.setParams({ title })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
