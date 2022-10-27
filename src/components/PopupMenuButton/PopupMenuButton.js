import React, { useRef, useState } from 'react'
import { UIManager, findNodeHandle, TouchableOpacity } from 'react-native'
import { isIOS } from 'util/platform'
import useHyloActionSheet from 'hooks/useHyloActionSheet'

export default function PopupMenuButton ({
  actions,
  children,
  viewProps,
  style,
  hitSlop = { top: 5, bottom: 5, left: 5, right: 5 }
}) {
  const { showHyloActionSheet } = useHyloActionSheet()
  const handlePress = () => showHyloActionSheet({ actions })

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={style}
      hitSlop={hitSlop}
      {...viewProps}
    >
      {children}
    </TouchableOpacity>
  )
}
