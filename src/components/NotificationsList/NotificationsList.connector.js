import { connect } from 'react-redux'
import {
  FETCH_NOTIFICATIONS,
  fetchNotifications,
  getNotifications,
  getHasMoreNotifications,
  markActivityRead,
  markAllActivitiesRead,
  updateNewNotificationCount
} from './NotificationsList.store'
import { headerButton } from 'util/header'

const NOTIFICATIONS_PAGE_SIZE = 20

export function mapStateToProps (state, props) {
  return {
    hasMore: getHasMoreNotifications(state),
    pending: state.pending[FETCH_NOTIFICATIONS],
    notifications: getNotifications(state, props)
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  const right = {
    onPress: () => dispatch(markAllActivitiesRead()),
    text: 'Mark as read'
  }
  return {
    fetchNotifications: () => dispatch(fetchNotifications(NOTIFICATIONS_PAGE_SIZE)),
    fetchMore: offset => dispatch(fetchNotifications(NOTIFICATIONS_PAGE_SIZE, offset)),
    markActivityRead: id => dispatch(markActivityRead(id)),
    setRightButton: () => navigation.setParams({ headerRight: headerButton(right) }),
    updateNewNotificationCount: () => dispatch(updateNewNotificationCount())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
