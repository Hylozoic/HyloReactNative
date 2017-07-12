import React from 'react'

import Icon from '../../../Icon'
import styles from '../Header.styles'

export default function MessagesIcon (props) {
  const { showMessages } = props
  return <Icon
    name='Messages'
    style={styles.messagesIcon}
    onPress={showMessages}
  />
}
