import React from 'react'
import { View } from 'react-native'
import { get } from 'lodash/fp'

import MenuButton from './MenuButton'
import MessagesIcon from './MessagesIcon'
import NotificationsIcon from './NotificationsIcon'
import styles from './Header.styles'

export default function Header (navigation, title) {
  const hasUnreadMessages = get('hasUnreadMessages', navigation.state.params)
  const hasUnreadNotifications = get('hasUnreadNotifications', navigation.state.params)

  const openDrawer = () => navigation.navigate('DrawerOpen')
  const showMessages = () => navigation.navigate('ThreadList')
  const showNotifications = () => navigation.navigate('NotificationsList')

  return {
    headerTitle: title,
    headerTitleStyle: styles.headerTitle,
    headerLeft: <MenuButton openDrawer={openDrawer} />,
    headerRight: <View style={styles.controls}>
      <MessagesIcon
        hasUnreadMessages={hasUnreadMessages}
        showMessages={showMessages} />
      <NotificationsIcon
        hasUnreadNotifications={hasUnreadNotifications}
        showNotifications={showNotifications} />
    </View>
  }
}
