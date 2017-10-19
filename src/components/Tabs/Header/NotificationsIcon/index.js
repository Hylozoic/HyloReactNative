import React from 'react'

import BadgedIcon from '../../../BadgedIcon'
import styles from '../Header.styles'

export default function NotificationsIcon ({ hasUnreadNotifications, showNotifications }) {
  return <BadgedIcon
    name='Notifications'
    onPress={showNotifications}
    showBadge={hasUnreadNotifications}
    style={styles.icon}
  />
}
