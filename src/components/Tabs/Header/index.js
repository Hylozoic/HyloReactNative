import React from 'react'
import { Text, View } from 'react-native'

import MenuButton from './MenuButton'
import MessagesIcon from './MessagesIcon'
import NotificationsIcon from './NotificationsIcon'
import styles from './Header.styles'

export default function Header (navigation, title) {
  const openDrawer = () => navigation.navigate('DrawerOpen')
  const showMessages = () => navigation.navigate('ThreadList')
  const showNotifications = () => navigation.navigate('NotificationsList', { title: 'Notifications' })

  return {
    headerTitle: <Text style={styles.headerTitle}>{title}</Text>,
    headerLeft: <MenuButton openDrawer={openDrawer} />,
    headerRight: <View style={styles.controls}>
      <MessagesIcon showMessages={showMessages} />
      <NotificationsIcon showNotifications={showNotifications} />
    </View>
  }
}
