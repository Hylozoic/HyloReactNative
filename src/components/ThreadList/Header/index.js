import React from 'react'
import { Text } from 'react-native'

import CloseButton from './CloseButton'
import styles from './Header.styles.js'

export default function Header (navigation) {
  const { goBack } = navigation

  const closeMessages = () => {
    goBack()
  }

  return {
    headerTitle: <Text style={styles.title}>Messages</Text>,
    headerLeft: <CloseButton closeMessages={closeMessages} />,
    headerRight: <Text style={styles.newButton}>New</Text>
  }
}
