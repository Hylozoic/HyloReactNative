import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import { getThreads } from './ThreadList.store'
import fetchThreads, { FETCH_THREADS } from '../../store/actions/fetchThreads'

export function mapStateToProps (state, props) {
  const threads = getThreads(state, props)
  const currentUser = getMe(state)
  return {
    threads,
    pending: state.pending[FETCH_THREADS],
    currentUser
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchThreads: () => dispatch(fetchThreads())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
