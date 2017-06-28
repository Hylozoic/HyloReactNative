import { ActionSheetIOS, TouchableOpacity } from 'react-native'
import React from 'react'

export default function ({ actions, onSelect, destructiveButtonIndex, children }) {
  const onPress = () => {
    const cancelButtonIndex = actions.length
    ActionSheetIOS.showActionSheetWithOptions({
      options: actions.concat(['Cancel']),
      destructiveButtonIndex,
      cancelButtonIndex: actions.length
    }, index => index !== cancelButtonIndex && onSelect(index))
  }
  return <TouchableOpacity onPress={onPress}>
    {children}
  </TouchableOpacity>
}
