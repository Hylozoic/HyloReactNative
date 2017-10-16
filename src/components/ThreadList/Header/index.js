import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import CloseButton from './CloseButton'
import styles from './Header.styles.js'

export default function Header (navigation) {
  const { goBack } = navigation

  const closeMessages = () => {
    goBack()
  }

  const goToNewMessage = () => {
    navigation.navigate('NewMessage')
  }

  return {
    headerTitle: <Text style={styles.title}>Messages</Text>,
    headerLeft: <CloseButton closeMessages={closeMessages} />,
    headerRight: <TouchableOpacity
      onPress={goToNewMessage}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <Text style={styles.newButton}>New</Text>
    </TouchableOpacity>
  }
}
