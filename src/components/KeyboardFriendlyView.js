import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { isIOS } from 'util/platform'

export default function ({ children, ...props }) {
  const allProps = {
    ...props,
    behavior: isIOS ? 'padding' : 'height',
    keyboardVerticalOffset: isIOS ? 74 : 64
  }
  return <KeyboardAvoidingView {...allProps}>
    {children}
  </KeyboardAvoidingView>
}
