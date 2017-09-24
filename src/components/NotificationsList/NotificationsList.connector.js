import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import {
  FETCH_NOTIFICATIONS,
  fetchNotifications,
  getNotifications,
  getNotificationsHasMore
} from './NotificationsList.store'

export function mapStateToProps (state, props) {
  const notifications = getNotifications(state, props)
  const currentUser = getMe(state)
  const hasMore = getNotificationsHasMore(state, props)
  return {
    pending: state.pending[FETCH_NOTIFICATIONS],
    currentUser,
    notifications,
    hasMore
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    fetchNotifications: (first, offset) => dispatch(fetchNotifications(first, offset)),
    showNotification: () => navigation.navigate('')
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { notifications, hasMore } = stateProps

  const fetchNotifications = () => dispatchProps.fetchNotifications(10)

  const fetchMoreNotifications =
    hasMore
      ? () => dispatchProps.fetchNotifications(10, notifications.length)
      : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchNotifications,
    fetchMoreNotifications
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
