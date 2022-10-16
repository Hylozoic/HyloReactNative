import React, { useRef, useState } from 'react'
import { UIManager, findNodeHandle, TouchableOpacity } from 'react-native'
import { isIOS } from 'util/platform'
import useHyloActionSheet from 'hooks/useHyloActionSheet'

export default function PopupMenuButton ({
  actions,
  // If you prefer the PopupMenu Style for Android
  useAndroidPopup,
  children,
  viewProps,
  style,
  hitSlop = { top: 5, bottom: 5, left: 5, right: 5 }
}) {
  const { showHyloActionSheet } = useHyloActionSheet()
  const buttonRef = useRef()
  const [open, setOpen] = useState()

  const showAndroidPopup = () => {
    if (buttonRef.current && !open) {
      UIManager.showPopupMenu(
        findNodeHandle(buttonRef.current),
        actions.map(a => a[0]),
        // onError
        e => {
          setOpen(false)

          throw new Error('Error opening popup')
        },
        // onSelect
        (action, index) => {
          setOpen(false)

          if (action === 'itemSelected') {
            actions[index][1]()
          }
        }
      )
    }
  }

  const handlePress = !isIOS && useAndroidPopup
    ? showAndroidPopup
    : () => showHyloActionSheet({ actions })

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={style}
      hitSlop={hitSlop}
      {...viewProps}
      ref={buttonRef}
    >
      {children}
    </TouchableOpacity>
  )
}
