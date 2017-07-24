import { connect } from 'react-redux'
import {
  fetchThread,
  getThread
} from './Thread.store'
import getMe from '../../store/selectors/getMe'

function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    thread: getThread(state, props)
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  return {
    fetchThread: () => dispatch(fetchThread(navigation.state.params.id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
