import { useActionSheet } from '@expo/react-native-action-sheet'
import React, { useRef, useState } from 'react'
import { UIManager, findNodeHandle, TouchableOpacity } from 'react-native'
import { isEmpty, filter } from 'lodash/fp'
import { pictonBlue } from 'style/colors'
import { isIOS } from 'util/platform'
import { DefaultTheme } from '@react-navigation/native'

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

/*

  Example usage:

    ```
    const { showHyloActionSheet } = useHyloActionSheet

    showHyloActionSheet({
      actions: [
        ['This is the Label', actionFunction, <Icon ... (only applies to Android)  />, destructive],
        ...
      ],
      // alternatively pass in `@expo/react-native-action-sheet` options which takes all
      // `ActionSheetIOS` options with additions. See docs for that library.
    })
    ```

*/
export function useHyloActionSheet () {
  const { showActionSheetWithOptions } = useActionSheet()

  return {
    showHyloActionSheet: ({ actions: providedActions, ...overrideParams }, providedOnSelect) => {
      // Eliminate any actions without an action function
      let actions = filter(action => action[1], providedActions)

      // Do nothing if no actions left
      if (isEmpty(actions)) return

      // Add "Cancel" item at the end
      actions = [
        ...actions,
        // <Icon name='Ex' key='cancel' style={{ fontSize: 18, margin: 0, padding: 0, color: pictonBlue }} />
        ['Cancel', null]
      ]

      const options = actions.map(action => action[0])
      const cancelButtonIndex = actions.length - 1
      const destructiveButtonIndex = []

      actions.forEach((action, index) => {
        if (action[2] && action[2]?.destructive) {
          destructiveButtonIndex.push(index)
        }
      })

      const onSelect = providedOnSelect || (index => actions[index][1] && actions[index][1]())
      const icons = actions.map(action => action[2] && action[2]?.icon)

      showActionSheetWithOptions(
        {
          options,
          tintColor: DefaultTheme.primaryColor,
          cancelButtonIndex,
          cancelButtonTintColor: isIOS ? DefaultTheme.primaryColor : pictonBlue,
          destructiveButtonIndex,
          // Great options for adding more context (e.g. Title of Post, etc)
          // title: '',
          // message: '',
          // Above params are compataible with RN iOS ActionSheet
          // The following params are specific to `@expo/react-native-action-sheet`
          // and only relevant for Android.
          icons,
          showSeparators: true,
          autoFocus: true,
          containerStyle: { padding: 10 },
          textStyle: { fontSize: 18 },
          ...overrideParams
        },
        onSelect
      )
    }
  }
}
