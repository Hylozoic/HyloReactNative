import React from 'react'

import BadgedIcon from '../../../BadgedIcon'
import styles from '../Header.styles'

export default function NotificationsIcon ({ showBadge, showNotifications }) {
  return <BadgedIcon
    name='Notifications'
    onPress={showNotifications}
    showBadge={showBadge}
    style={styles.icon}
  />
}
