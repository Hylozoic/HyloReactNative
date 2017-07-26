import { connect } from 'react-redux'
import {
  fetchMessages,
  getMessages
} from './Thread.store'
import getMe from '../../store/selectors/getMe'

function mapStateToProps (state, props) {
  return {
    messages: getMessages(state, props)
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  return {
    fetchMessages: () => dispatch(fetchMessages(navigation.state.params.id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
