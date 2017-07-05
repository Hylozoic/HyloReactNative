import React from 'react'
import { Text } from 'react-native'

import MenuButton from './MenuButton'
import styles from './styles'

export default function Header (navigation, title) {
  return {
    headerTitle: <Text style={styles.headerTitle}>{title}</Text>,
    headerLeft: <MenuButton navigation={navigation} />
  }
}
