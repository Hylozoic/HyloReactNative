import React from 'react'
import { Text } from 'react-native'

import MenuButton from './MenuButton'
import styles from './styles'

export default function Header (navigation) {
  return {
    headerTitle: <Text style={styles.headerTitle}>Home</Text>,
    headerLeft: <MenuButton navigation={navigation} />
  }
}
