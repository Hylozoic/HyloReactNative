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
    fetchNotifications: first => dispatch(fetchNotifications(first)),
    showNotification: () => navigation.navigate('')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
