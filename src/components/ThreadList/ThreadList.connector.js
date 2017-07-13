import { connect } from 'react-redux'
import { getThreads } from './ThreadList.store'
import fetchThreads, { FETCH_THREADS } from '../../store/actions/fetchThreads'

export function mapStateToProps (state, props) {
  const threads = getThreads(state, props)
  return {
    threads,
    pending: state.pending[FETCH_THREADS]
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchThreads: () => dispatch(fetchThreads())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
