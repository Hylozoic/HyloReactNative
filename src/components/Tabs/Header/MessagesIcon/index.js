import React from 'react'

import BadgedIcon from '../../../BadgedIcon'
import styles from '../Header.styles'

export default function MessagesIcon ({ hasUnreadMessages, showMessages }) {
  return <BadgedIcon
    name='Messages'
    onPress={showMessages}
    showBadge={hasUnreadMessages}
    style={styles.icon}
  />
}
