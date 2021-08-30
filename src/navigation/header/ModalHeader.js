import React from 'react'
import { HeaderBackButton, Header } from '@react-navigation/elements'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import FocusAwareStatusBar from 'components/FocusAwareStatusBar'
import HeaderRightButton from 'navigation/header/HeaderRightButton'
import HeaderLeftCloseIcon from 'navigation/header/HeaderLeftCloseIcon'
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
  const options = {
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
    title: otherProps?.headerTitle
  }

  return <Header {...options} {...otherProps} />
}

export const WorkflowModalHeader = workflowHeaderProps => {
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
    {...workflowHeaderProps}
  />
}
