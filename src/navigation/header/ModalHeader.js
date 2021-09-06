import React from 'react'
import { View } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { HeaderBackButton, Header } from '@react-navigation/elements'
import { isIOS } from 'util/platform'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import FocusAwareStatusBar from 'components/FocusAwareStatusBar'
import HeaderRightButton from 'navigation/header/HeaderRightButton'
import HeaderLeftCloseIcon from 'navigation/header/HeaderLeftCloseIcon'
import NotificationsIcon from 'navigation/header/NotificationsIcon'
import MenuButton from 'navigation/header/MenuButton'
import {
  white, caribbeanGreen, white60onCaribbeanGreen, black10onRhino, rhino05, rhino80
} from 'style/colors'

export default function ModalHeader ({
  navigation,
  route,
  back,
  // custom props
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
  ...otherProps
}) {
  const headerTitleStyleColor = otherProps?.headerTitleStyle?.color ?? black10onRhino
  const props = {
    presentation: 'modal',
    cardStyle: {
      backgroundColor: white
    },
    headerStyle: {
      backgroundColor: rhino05,
      // ...otherProps.headerStyle
    },
    headerTintColor: rhino80,
    headerTitleAlign: 'center',
    headerTitleStyle: {
      color: headerTitleStyleColor,
      fontFamily: 'Circular-Bold',
      // maxWidth: '80%'
    },
    headerLeft: props => {
      // get go back function from navigation
      const headerLeftOnPress = providedHeaderLeftOnPress
        ? providedHeaderLeftOnPress
        : navigation.goBack
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
    ),
    // TODO: Figure-out why headerTitle wasn't already working
    // and incorporated Screen provided `title` which should be the fallback
    // https://reactnavigation.org/docs/stack-navigator
    title: otherProps?.headerTitle || route.name
  }

  return <Header {...props} {...otherProps} />
}

export const WorkflowModalHeader = props => {
  return <ModalHeader
    headerBackTitleVisible={false}
    headerLeftCloseIcon={false}
    headerStyle={{
      backgroundColor: caribbeanGreen,
      shadowColor: 'transparent'          
    }}
    headerTitleStyle={{
      color: white,
      fontFamily: 'Circular-Bold',
      fontSize: 12
    }}
    headerTintColor={white60onCaribbeanGreen}
    statusBarOptions={{
      backgroundColor: caribbeanGreen,
      barStyle: 'light-content'
    }}
    {...props}
  />
}

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

export const TabStackHeader = ({
  navigation,
  route,
  rootsScreenNames = TAB_STACK_ROOTS || {},
  ...otherProps
}) => {
  console.log('!!! route:', otherProps)
  const canGoBack = !rootsScreenNames.includes(route?.name)
  const props = {
    headerBackTitleVisible: false,
    title: getFocusedRouteNameFromRoute(route) ||
      otherProps?.options?.headerTitle || otherProps?.options?.title || route?.name,
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

  return <Header {...props} {...otherProps} />
}
