import { connect } from 'react-redux'
import {
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
  return {
    fetchMessages: () => dispatch(fetchMessages(navigation.state.params.id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
