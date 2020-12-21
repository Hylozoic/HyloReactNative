import React from 'react'
import { View } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import MenuButton from './MenuButton'
import SearchIcon from './SearchIcon'
import MessagesIcon from './MessagesIcon'
import NotificationsIcon from './NotificationsIcon'
import styles from './Header.styles'
import { rhino80, black10onRhino, black10OnCaribbeanGreen } from 'style/colors'

// TODO: Derive these from loaded navigator or otherwise from shape of navigation state?
export const TAB_ROOTS = ['Feed', 'Members', 'Topics', 'Projects']

export default function buildScreenOptionsForTabsHeader ({ navigation, route }) {
  const isOnTabRoot = TAB_ROOTS.includes(route.name)
  const showSearch = () => navigation.navigate('Search')
  const showMessages = () => navigation.navigate('Messages')
  const showNotifications = () => navigation.navigate('Notifications')

  return {
    headerBackTitleVisible: false,
    headerTitle: getFocusedRouteNameFromRoute(route) || route?.name,
    headerTitleStyle: styles.headerTitle,
    headerTitleContainerStyle: styles.headerTitleContainerStyle,
    headerStyle: {
      backgroundColor: rhino80
      // backgroundColor: black10onRhino
      // backgroundColor: black10OnCaribbeanGreen
    },
    headerLeft: () =>
      <MenuButton isOnTabRoot={isOnTabRoot} navigation={navigation} />,
    headerRight: () => isOnTabRoot &&
      <View style={styles.controls}>
        <SearchIcon showSearch={showSearch} />
        <MessagesIcon showMessages={showMessages} />
        <NotificationsIcon showNotifications={showNotifications} />
      </View>
  }
}
