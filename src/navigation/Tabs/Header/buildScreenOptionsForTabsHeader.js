import React from 'react'
import { View } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import MenuButton from './MenuButton'
import SearchIcon from './SearchIcon'
import MessagesIcon from './MessagesIcon'
import NotificationsIcon from './NotificationsIcon'
import styles from './Header.styles'

export default function buildScreenOptionsForTabsHeader ({ navigation, route }) {
  const openDrawer = () => navigation.openDrawer()
  const showSearch = () => navigation.navigate('Search')
  const showMessages = () => navigation.navigate('Messages')
  const showNotifications = () => navigation.navigate('Notifications')

  return {
    headerBackTitleVisible: false,
    headerTitle: getFocusedRouteNameFromRoute(route) ?? 'Home',
    headerTitleStyle: styles.headerTitle,
    headerLeft: () =>
      <MenuButton openDrawer={openDrawer} />,
    headerRight: () =>
      <View style={styles.controls}>
        <SearchIcon showSearch={showSearch} />
        <MessagesIcon showMessages={showMessages} />
        <NotificationsIcon showNotifications={showNotifications} />
      </View>
  }
}
