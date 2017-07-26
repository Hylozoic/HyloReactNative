import React from 'react'
import { Text } from 'react-native'

import MenuButton from './MenuButton'
import MessagesIcon from './MessagesIcon'
import styles from './Header.styles'

export default function Header (navigation, title) {
  const openDrawer = () => {
    navigation.navigate('DrawerOpen')
  }

  const showMessages = () => {
    navigation.navigate('ThreadList')
  }

  return {
    headerTitle: <Text style={styles.headerTitle}>{title}</Text>,
    headerLeft: <MenuButton openDrawer={openDrawer} />,
    headerRight: <MessagesIcon showMessages={showMessages} />
  }
}
