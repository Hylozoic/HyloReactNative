import React from 'react'

import BadgedIcon from 'components/BadgedIcon'
import styles from '../Header.styles'

export default function NotificationsIcon ({ showBadge, showNotifications }) {
  return (
    <BadgedIcon
      name='Notifications'
      action={showNotifications}
      showBadge={showBadge}
      style={styles.icon}
    />
  )
}
