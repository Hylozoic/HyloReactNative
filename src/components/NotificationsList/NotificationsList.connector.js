import { connect } from 'react-redux'
import {
  FETCH_NOTIFICATIONS,
  fetchNotifications,
  getNotifications,
  getNotificationsHasMore,
  markActivityRead,
  markAllActivitiesRead
} from './NotificationsList.store'
import { headerButton } from 'util/header'

const NOTIFICATIONS_PAGE_SIZE = 20

export function mapStateToProps (state, props) {
  return {
    hasMore: getNotificationsHasMore(state),
    pending: state.pending[FETCH_NOTIFICATIONS],
    notifications: getNotifications(state)
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  const right = {
    onPress: () => dispatch(markAllActivitiesRead()),
    text: 'Mark as read'
  }
  return {
    fetchNotifications: () => dispatch(fetchNotifications(NOTIFICATIONS_PAGE_SIZE)),
    // TODO: notifications needs a cursor on backend
    fetchMore: offset => dispatch(fetchNotifications(NOTIFICATIONS_PAGE_SIZE, NOTIFICATIONS_PAGE_SIZE)),
    setRightButton: () => navigation.setParams({ headerRight: headerButton(right) })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
