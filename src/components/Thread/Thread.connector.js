import { connect } from 'react-redux'
import { sanitize } from 'hylo-utils/text'
import { pick } from 'lodash/fp'

import {
  createMessage,
  fetchMessages,
  FETCH_MESSAGES,
  getHasMoreMessages,
  getMeForThread,
  getThread,
  updateThreadReadTime
} from './Thread.store'

function mapStateToProps (state, props) {
  const { id, messages, title } = getThread(state, props) || {}
  return {
    currentUser: getMeForThread(state),
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
    setTitle: title => navigation.setParams({ title }),
    updateThreadReadTime: () => dispatch(updateThreadReadTime(threadId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
