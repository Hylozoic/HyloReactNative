import React from 'react'

import BadgedIcon from '../../../BadgedIcon'
import styles from '../Header.styles'

export default function MessagesIcon (props) {
  const { showMessages } = props
  return <BadgedIcon
    name='Messages'
    style={styles.icon}
    onPress={showMessages}
  />
}
