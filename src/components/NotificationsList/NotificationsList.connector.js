import { connect } from 'react-redux'
import React from 'react'
import { isEmpty } from 'lodash'
import {
  FETCH_NOTIFICATIONS,
  fetchNotifications,
  getNotifications,
  getHasMoreNotifications,
  markActivityRead,
  markAllActivitiesRead,
  updateNewNotificationCount
} from './NotificationsList.store'
import getMemberships from '../../store/selectors/getMemberships'
import { HeaderButton } from 'navigation/header'
import { mapWhenFocused } from 'util/connector'

const NOTIFICATIONS_PAGE_SIZE = 20

export function mapStateToProps (state, props) {
  return {
    hasMore: getHasMoreNotifications(state),
    pending: state.pending[FETCH_NOTIFICATIONS],
    notifications: getNotifications(state, props),
    currentUserHasMemberships: !isEmpty(getMemberships(state))
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
    setRightButton: () => navigation.setParams({ headerRight: <HeaderButton {...right} /> }),
    updateNewNotificationCount: () => dispatch(updateNewNotificationCount()),
    goToCreateCommunityName: () => {
      navigation.navigate('CreateCommunityName')
    }
  }
}

export default connect(
  mapWhenFocused(mapStateToProps),
  mapWhenFocused(mapDispatchToProps)
)
