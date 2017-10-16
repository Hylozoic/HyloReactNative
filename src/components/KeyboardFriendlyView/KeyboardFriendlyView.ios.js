import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default function ({ children, ...props }) {
  return <KeyboardAvoidingView {...kavProps} {...props}>{children}</KeyboardAvoidingView>
}
