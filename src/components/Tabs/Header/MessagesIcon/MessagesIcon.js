import React from 'react'

import BadgedIcon from '../../../BadgedIcon'
import styles from '../Header.styles'

export default function MessagesIcon ({ showBadge, showMessages }) {
  return <BadgedIcon
    name='Messages'
    action={showMessages}
    showBadge={showBadge}
    style={styles.icon}
  />
}
