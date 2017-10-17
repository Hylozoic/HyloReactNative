import React from 'react'

import BadgedIcon from '../../../BadgedIcon'
import styles from '../Header.styles'

export default function NotificationsIcon (props) {
  return <BadgedIcon
    name='Notifications'
    style={styles.icon}
    onPress={props.showNotifications}
  />
}
