import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import fetchThreads, { FETCH_THREADS } from '../../store/actions/fetchThreads'
import { getThreads, getThreadsHasMore } from './ThreadList.store'

export function mapStateToProps (state, props) {
  const threads = getThreads(state, props)
  const currentUser = getMe(state)
  const hasMore = getThreadsHasMore(state, props)
  return {
    pending: state.pending[FETCH_THREADS],
    currentUser,
    threads,
    hasMore
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    fetchThreads: (first, offset) => dispatch(fetchThreads(first, offset)),
    showThread: id => navigation.navigate('Thread', {id})
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { threads, hasMore } = stateProps

  const fetchThreads = () => dispatchProps.fetchThreads(10)

  const fetchMoreThreads =
    hasMore
      ? () => dispatchProps.fetchThreads(10, threads.length)
      : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchThreads,
    fetchMoreThreads
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
