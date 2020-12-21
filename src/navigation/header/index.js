import React from 'react'
import { View } from 'react-native'
import { HeaderBackButton } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import HeaderRightButton from 'navigation/header/HeaderRightButton'
import HeaderLeftCloseIcon from 'navigation/header/HeaderLeftCloseIcon'
import MenuButton from 'navigation/header/MenuButton'
import SearchIcon from 'navigation/header/SearchIcon'
import MessagesIcon from 'navigation/header/MessagesIcon'
import NotificationsIcon from 'navigation/header/NotificationsIcon'
import { caribbeanGreen, rhino80, white60onCaribbeanGreen } from 'style/colors'
import styles from './header.styles'

// Mostly the modal header
export function buildDefaultHeaderOptions ({
  headerLeftCloseIcon = false,
  headerLeftOnPress: providedHeaderLeftOnPress,
  headerLeftConfirm,
  headerRightButtonLabel = 'Save',
  headerRightButtonOnPress,
  headerRightButtonDisabled,
  headerStyle = {
    backgroundColor: 'white'
  },
  headerTitleStyle = {
    color: 'black',
    fontFamily: 'Circular-Bold',
    fontSize: 17
  },
  ...otherOptions
}) {
  const options = {}

  options.headerLeft = props => {
    const headerLeftOnPress = providedHeaderLeftOnPress || props.onPress
    const onPress = headerLeftConfirm
      ? () => confirmDiscardChanges({ onDiscard: headerLeftOnPress })
      : headerLeftOnPress

    return headerLeftCloseIcon
      ? <HeaderLeftCloseIcon {...props} color={headerTitleStyle?.color ?? rhino80} onPress={onPress} />
      : <HeaderBackButton {...props} onPress={onPress} />
  }

  if (headerRightButtonOnPress) {
    options.headerRight = () => (
      <HeaderRightButton
        label={headerRightButtonLabel}
        onPress={headerRightButtonOnPress}
        disabled={headerRightButtonDisabled}
      />
    )
  }

  return {
    headerStyle,
    headerTitleStyle,
    ...options,
    ...otherOptions
  }
}

export const buildWorkflowHeaderOptions = params => {
  return buildDefaultHeaderOptions({
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: caribbeanGreen,
      shadowColor: 'transparent'          
    },
    headerTitleStyle: {
      color: 'white',
      fontFamily: 'Circular-Bold',
      fontSize: 12
    },
    headerTintColor: white60onCaribbeanGreen,
    ...params
  })  
}

// TODO: Derive these from loaded navigator or otherwise from shape of navigation state?
export const TAB_ROOTS = ['Feed', 'Members', 'Topics', 'Projects']

// Most generally a stack header
export function buildTabsHeaderOptions ({
  navigation,
  route
}, rootsScreenNames = TAB_ROOTS || {}) {
  const atRoot = rootsScreenNames.includes(route.name)
  const showSearch = () => navigation.navigate('Search')
  const showMessages = () => navigation.navigate('Messages')
  const showNotifications = () => navigation.navigate('Notifications')

  return {
    headerBackTitleVisible: false,
    headerTitle: getFocusedRouteNameFromRoute(route) || route?.name,
    headerTitleContainerStyle: styles.headerTitleContainerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerStyle: styles.headerStyle,
    headerLeft: () =>
      <MenuButton atRoot={atRoot} navigation={navigation} />,
    headerRight: () => atRoot && (
      <View style={styles.headerRight}>
        <SearchIcon showSearch={showSearch} />
        <MessagesIcon showMessages={showMessages} />
        <NotificationsIcon showNotifications={showNotifications} />
      </View>
    )
  }
}
