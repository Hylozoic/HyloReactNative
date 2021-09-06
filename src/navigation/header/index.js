import React from 'react'
import { View } from 'react-native'
import { HeaderBackButton } from '@react-navigation/elements'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import { isIOS } from 'util/platform'
import FocusAwareStatusBar from 'components/FocusAwareStatusBar'
import HeaderRightButton from 'navigation/header/HeaderRightButton'
import HeaderLeftCloseIcon from 'navigation/header/HeaderLeftCloseIcon'
import MenuButton from 'navigation/header/MenuButton'
import NotificationsIcon from 'navigation/header/NotificationsIcon'
import {  caribbeanGreen, white60onCaribbeanGreen, white, rhino80, black10onRhino, rhino05 } from 'style/colors'

// TODO: Replace each function below with a custom header component/s as per:
// https://reactnavigation.org/docs/stack-navigator#header
//
// For now this list needs to be kept in sync with the names of the initial
// routes for each stack in navigation/TabsNavigator.
export const TAB_STACK_ROOTS = [
  'Group Navigation',
  'Messages',
  'Search',
  'Profile'
]

export function buildTabStackScreenOptions ({
  navigation,
  route,
  rootsScreenNames = TAB_STACK_ROOTS || {},
  ...otherOptions
}) {
  const canGoBack = !rootsScreenNames.includes(route?.name)
  const options = {
    headerBackTitleVisible: false,
    headerTitle: getFocusedRouteNameFromRoute(route)
      || route?.name,
    headerTitleContainerStyle: {
      // Follow: https://github.com/react-navigation/react-navigation/issues/7057#issuecomment-593086348
      width: isIOS ? '55%' : '45%',
      alignItems: 'center',
      marginLeft: isIOS ? 0 : 10
    },
    headerTitleStyle: {
      color: white,
      fontFamily: 'Circular-Bold',
      fontSize: 18
    },
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: rhino80
      // backgroundColor: black10onRhino
      // backgroundColor: black10OnCaribbeanGreen
    },
    headerLeft: () => (
      <>
        <FocusAwareStatusBar barStyle='light-content' backgroundColor={rhino80} />
        <MenuButton canGoBack={canGoBack} navigation={navigation} />
      </>
    ),
    headerRight: () =>  (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
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
  headerLeftCloseIcon = true,
  headerLeftLabel,
  headerLeftOnPress: providedHeaderLeftOnPress,
  headerLeftConfirm,
  headerRightButtonLabel = 'Save',
  headerRightButtonOnPress,
  headerRightButtonDisabled,
  statusBarOptions = {
    backgroundColor: rhino05,
    barStyle: 'dark-content'
  },
  ...otherOptions
}) {
  const headerTitleStyleColor = otherOptions?.headerTitleStyle?.color ?? black10onRhino
  const options = {
    presentation: 'modal',
    cardStyle: {
      backgroundColor: white
    },
    headerStyle: {
      backgroundColor: rhino05
    },
    headerTintColor: rhino80,
    headerTitleAlign: 'center',
    headerTitleStyle: {
      color: headerTitleStyleColor,
      fontFamily: 'Circular-Bold',
      // maxWidth: '80%'
    },
    headerLeft: props => {
      const headerLeftOnPress = providedHeaderLeftOnPress
      const onPress = headerLeftConfirm
        ? () => confirmDiscardChanges({ onDiscard: headerLeftOnPress })
        : headerLeftOnPress
      const label = headerLeftLabel
        ? headerLeftLabel
        : props.label 
      return (
        <>
          <FocusAwareStatusBar {...statusBarOptions} />
          {headerLeftCloseIcon
            ? <HeaderLeftCloseIcon {...props} color={headerTitleStyleColor} onPress={onPress} />
            : <HeaderBackButton {...props} label={label} onPress={onPress} />}
          </>
      )
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
    headerLeftCloseIcon: false,
    headerStyle: {
      backgroundColor: caribbeanGreen,
      shadowColor: 'transparent'          
    },
    headerTitleStyle: {
      color: white,
      fontFamily: 'Circular-Bold',
      fontSize: 12
    },
    headerTintColor: white60onCaribbeanGreen,
    statusBarOptions: {
      backgroundColor: caribbeanGreen,
      barStyle: 'light-content'
    },  
    ...providedOptions
  })  
}
