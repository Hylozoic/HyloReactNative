import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import getMe from '../../store/selectors/getMe'
import fetchThreads, { FETCH_THREADS } from '../../store/actions/fetchThreads'
import { getThreads, getThreadsHasMore, updateLastViewed } from './ThreadList.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const threads = getThreads(state, props)
  const currentUser = getMe(state)
  const hasMore = getThreadsHasMore(state, props)
  const pending = state.pending[FETCH_THREADS]
  return {
    pending,
    pendingRefresh: !!(pending && pending.extractQueryResults.reset),
    currentUser,
    threads,
    hasMore,
    isConnected: state.SocketListener.connected
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    showThread: threadOrId => navigation.navigate('Thread', {
      id: get('id', threadOrId) || threadOrId
    }),
    ...bindActionCreators({
      updateLastViewed,
      fetchThreads
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { threads, hasMore } = stateProps

  const fetchThreads = () => {
    dispatchProps.fetchThreads(10)
    dispatchProps.updateLastViewed()
  }

  const fetchMoreThreads =
    hasMore
      ? () => dispatchProps.fetchThreads(10, threads.length)
      : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchThreads,
    fetchMoreThreads,
    refreshThreads: () => dispatchProps.fetchThreads(10, 0, true)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
