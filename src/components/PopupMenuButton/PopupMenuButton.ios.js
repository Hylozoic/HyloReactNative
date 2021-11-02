import React from 'react'
import { ActionSheetIOS, TouchableOpacity } from 'react-native'

export default function PopupMenuButton ({
  actions,
  destructiveButtonIndex,
  children,
  viewProps,
  style,
  hitSlop = { top: 5, bottom: 5, left: 5, right: 5 }
}) {
  const onSelect = index => actions[index][1]()

  const onPress = () => {
    const cancelButtonIndex = actions.length
    ActionSheetIOS.showActionSheetWithOptions({
      options: actions.map(a => a[0]).concat(['Cancel']),
      destructiveButtonIndex,
      cancelButtonIndex: actions.length
    }, index => index !== cancelButtonIndex && onSelect(index))
  }

  return (
    <TouchableOpacity onPress={onPress} style={style} hitSlop={hitSlop} {...viewProps}>
      {children}
    </TouchableOpacity>
  )
}
