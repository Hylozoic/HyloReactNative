import React from 'react'
import BadgedIcon from 'components/BadgedIcon'
import styles from '../header.styles'

export default function NotificationsIcon ({ showBadge, showNotifications }) {
  return (
    <BadgedIcon
      name='Notifications'
      action={showNotifications}
      showBadge={showBadge}
      style={styles.headerIcon}
    />
  )
}
