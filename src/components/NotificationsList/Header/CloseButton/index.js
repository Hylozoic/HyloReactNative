import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

import styles from '../Header.styles.js'

export default function CloseButton (props) {
  const { closeMessages } = props
  return <TouchableOpacity onPress={closeMessages}>
    <Text style={styles.closeButton}>Close</Text>
  </TouchableOpacity>
}
