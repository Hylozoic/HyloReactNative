import React from 'react'

import Icon from '../../../Icon'
import styles from '../Header.styles'

export default function NotificationsIcon (props) {
  const { showNotifications } = props
  return <Icon
    name='Notifications'
    style={styles.icon}
    onPress={showNotifications}
  />
}
