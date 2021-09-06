import React from 'react'
import BadgedIcon from 'components/BadgedIcon'
import styles from '../header.styles'

export default function MessagesIcon ({ showBadge, showMessages }) {
  return (
    <BadgedIcon
      name='Messages'
      action={showMessages}
      showBadge={showBadge}
      style={styles.headerIcon}
    />
  )
}
