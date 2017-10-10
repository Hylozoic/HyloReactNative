import { ActionSheetIOS, TouchableOpacity } from 'react-native'
import React from 'react'

export default function PopupMenuButton ({ actions,
  onSelect,
  destructiveButtonIndex,
  children,
  viewProps,
  style,
  hitSlop = {top: 5, bottom: 5, left: 5, right: 5} }) {
  const onPress = () => {
    const cancelButtonIndex = actions.length
    ActionSheetIOS.showActionSheetWithOptions({
      options: actions.concat(['Cancel']),
      destructiveButtonIndex,
      cancelButtonIndex: actions.length
    }, index => index !== cancelButtonIndex && onSelect(index))
  }

  return <TouchableOpacity onPress={onPress} style={style} hitSlop={hitSlop} {...viewProps}>
    {children}
  </TouchableOpacity>
}
