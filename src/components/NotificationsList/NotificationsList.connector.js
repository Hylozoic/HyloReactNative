import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import {
  FETCH_NOTIFICATIONS,
  fetchNotifications,
  getNotifications,
  getNotificationsHasMore,
  markAllActivitiesRead
} from './NotificationsList.store'
import { headerButton } from 'util/header'

export function mapStateToProps (state, props) {
  const notifications = getNotifications(state, props)
  const currentUser = getMe(state)
  // const hasMore = getNotificationsHasMore(state, props)
  return {
    pending: state.pending[FETCH_NOTIFICATIONS],
    currentUser,
    notifications
    // hasMore
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  const right = {
    onPress: () => dispatch(markAllActivitiesRead()),
    text: 'Mark as read'
  }
  return {
    fetchNotifications: first => dispatch(fetchNotifications(first)),
    setRightButton: () => navigation.setParams({ headerRight: headerButton(right) }),
    showNotification: () => navigation.navigate('')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
