import React from 'react'
import { View } from 'react-native'

import MenuButton from './MenuButton'
import MessagesIcon from './MessagesIcon'
import NotificationsIcon from './NotificationsIcon'
import styles from './Header.styles'

export default function Header (navigation, title) {
  const openDrawer = () => navigation.navigate('DrawerOpen')
  const showMessages = () => navigation.navigate({routeName: 'ThreadList', key: 'ThreadList'})
  const showNotifications = () => navigation.navigate({routeName: 'NotificationsList', key: 'NotificationsList'})

  return {
    headerBackTitle: null,
    headerTitle: title,
    headerTitleStyle: styles.headerTitle,
    headerLeft: <MenuButton openDrawer={openDrawer} />,
    headerRight: <View style={styles.controls}>
      <MessagesIcon
        showMessages={showMessages} />
      <NotificationsIcon
        showNotifications={showNotifications} />
    </View>
  }
}
