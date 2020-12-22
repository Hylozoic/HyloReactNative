import React from 'react'
import { View } from 'react-native'
import { HeaderBackButton } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import { isIOS } from 'util/platform'
import HeaderRightButton from 'navigation/header/HeaderRightButton'
import HeaderLeftCloseIcon from 'navigation/header/HeaderLeftCloseIcon'
import MenuButton from 'navigation/header/MenuButton'
import SearchIcon from 'navigation/header/SearchIcon'
import MessagesIcon from 'navigation/header/MessagesIcon'
import NotificationsIcon from 'navigation/header/NotificationsIcon'
import { 
  black10onRhino, caribbeanGreen, white60onCaribbeanGreen, white, rhino80
} from 'style/colors'

// Keep in sync with stack navigator root name changes in navigation/TabsNavigator
// This won't be necessary once fully custom header is built
export const TAB_STACK_ROOTS = [
  'Home',
  'Members',
  'Topics',
  'Projects'
]

// TODO: Replace each of the below with a custom header component/s as per:
// https://reactnavigation.org/docs/stack-navigator#header

export function buildTabStackScreenOptions ({
  navigation,
  route,
  rootsScreenNames = TAB_STACK_ROOTS || {},
  ...otherOptions
}) {
  const atRoot = rootsScreenNames.includes(route?.name)
  const options = {
    headerBackTitleVisible: false,
    headerTitle: getFocusedRouteNameFromRoute(route)
      || route?.name,
    headerTitleContainerStyle: {
      // // Follow: https://github.com/react-navigation/react-navigation/issues/7057#issuecomment-593086348
      // width: isIOS ? '40%' : '75%',
      // alignItems: isIOS ? 'center' : 'flex-start'
      marginLeft: isIOS ? 0 : 10
    },
    headerTitleStyle: {
      color: white,
      fontFamily: 'Circular-Bold',
      fontSize: 18,
      fontWeight: '200'
    },
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: rhino80
      // backgroundColor: black10onRhino
      // backgroundColor: black10OnCaribbeanGreen
    },  
    headerLeft: () =>
      <MenuButton atRoot={atRoot} navigation={navigation} />,
    headerRight: () => atRoot && (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <SearchIcon showSearch={() => navigation.navigate('Search')} />
        <MessagesIcon showMessages={() => navigation.navigate('Messages')} />
        <NotificationsIcon showNotifications={() => navigation.navigate('Notifications')} />
      </View>
    )
  }

  return {
    ...options,
    ...otherOptions
  }
}

export function buildModalScreenOptions ({
  headerLeftCloseIcon = false,
  headerLeftOnPress: providedHeaderLeftOnPress,
  headerLeftConfirm,
  headerRightButtonLabel = 'Save',
  headerRightButtonOnPress,
  headerRightButtonDisabled,
  ...otherOptions
}) {
  const headerTitleStyleColor = otherOptions?.headerTitleStyle?.color ?? black10onRhino
  const options = {
    headerTitleStyle: {
      color: headerTitleStyleColor,
      fontFamily: 'Circular-Bold',
      fontSize: 17
    },
    headerStyle: {
      backgroundColor: 'white'
    },
    headerTitleAlign: 'center',
    headerLeft: props => {
      const headerLeftOnPress = providedHeaderLeftOnPress || props.onPress
      const onPress = headerLeftConfirm
        ? () => confirmDiscardChanges({ onDiscard: headerLeftOnPress })
        : headerLeftOnPress
  
      return headerLeftCloseIcon
        ? <HeaderLeftCloseIcon {...props} color={headerTitleStyleColor} onPress={onPress} />
        : <HeaderBackButton {...props} onPress={onPress} />
    },
    headerRight: () => headerRightButtonOnPress && (
      <HeaderRightButton
        label={headerRightButtonLabel}
        onPress={headerRightButtonOnPress}
        disabled={headerRightButtonDisabled}
      />
    )
  }

  return {
    ...options,
    ...otherOptions
  }
}

export const buildWorkflowModalScreenOptions = providedOptions => {
  return buildModalScreenOptions({
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
    ...providedOptions
  })  
}
